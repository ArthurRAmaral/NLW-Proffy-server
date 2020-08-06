import express from "express";
import db from "./database/connection";
import convertHoursToMinutes from "./utils/convertHoursToMinutes";

const routes = express.Router();

interface ScheduleItem {
  week_day: number;
  from: string;
  to: string;
}

routes.post("/classes", async (req, res) => {
  const { name, avatar, whatsapp, bio, subject, cost, schedule } = req.body;

  const trx = await db.transaction(async (trx) => {
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

      trx.commit();

      return res.status(201).send();
    } catch (err) {
      await trx.rollback();
      console.error(err);
      return res
        .status(500)
        .json({ error: "Unexpected error while inserting new classes" });
    }
  });
});

export default routes;
