import { Request, Response } from "express";
import db from "../database/connection";

export default class ConnectionsController {
  async index(req: Request, res: Response) {
    const allConnections = await db("connections");
    return res.json(allConnections);
  }

  async quantity(req: Request, res: Response) {
    const total = (await db("connections")).length;
    return res.json({ total });
  }

  async create(req: Request, res: Response) {
    const { user_id } = req.body;

    if (!user_id) return res.status(400).send();

    await db("connections").insert({ user_id });

    return res.status(201).send();
  }
}
