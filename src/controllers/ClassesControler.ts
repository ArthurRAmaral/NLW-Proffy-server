import { Request, Response } from "express";
import db from "../database/connection";
import convertHoursToMinutes from "../utils/convertHoursToMinutes";

interface ScheduleItem {
  week_day: number;
  from: string;
  to: string;
}

export default class ClassesController {
  async index(req: Request, res: Response) {
    const filters = req.query;

    const week_day = Number(filters.week_day);
    const subject = filters.subject as string;
    const time = filters.time as string;

    // if (!week_day || !subject || !time)
    //   return res.status(400).json({
    //     status: 400,
    //     error: "Missing filters to search classes",
    //   });
    try {
      const timeInMinutes = convertHoursToMinutes(time);

      let holder = db("classes").whereExists(function () {
        let holder = this.select("classes_schedules.*")
          .from("classes_schedules")
          .whereRaw("`classes_schedules`.`class_id` = `classes`.`id`");

        holder = week_day
          ? holder.whereRaw("`classes_schedules`.`week_day` = ??", [week_day])
          : holder;

        holder = timeInMinutes
          ? holder
              .whereRaw("`classes_schedules`.`from` <= ??", [timeInMinutes])
              .whereRaw("`classes_schedules`.`to` > ??", [timeInMinutes])
          : holder;
      });
      // ;
      // subject && (holder = holder
      holder = subject ? holder.where("classes.subject", "=", subject) : holder;
      // )
      // const classes = await holder
      const classes = await holder
        .join("users", "classes.user_id", "=", "users.id")
        .select(["classes.*", "users.*"]);

      return res.json(classes);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  }

  async create(req: Request, res: Response) {
    const { name, avatar, whatsapp, bio, subject, cost, schedule } = req.body;

    await db.transaction(async (trx) => {
      try {
        const insertedUsersIds = await trx("users").insert({
          name,
          avatar,
          whatsapp,
          bio,
        });

        const user_id = insertedUsersIds[0];

        const insertedClassesIds = await trx("classes").insert({
          subject,
          cost,
          user_id,
        });

        const class_id = insertedUsersIds[0];

        const classesSchedule = schedule.map((scheduleItem: ScheduleItem) => {
          return {
            week_day: scheduleItem.week_day,
            from: convertHoursToMinutes(scheduleItem.from),
            to: convertHoursToMinutes(scheduleItem.to),
            class_id,
          };
        });

        await trx("classes_schedules").insert(classesSchedule);

        await trx.commit();

        return res.status(201).send();
      } catch (err) {
        await trx.rollback();

        return res
          .status(500)
          .json({ error: "Unexpected error while inserting new classes" });
      }
    });
  }
}
