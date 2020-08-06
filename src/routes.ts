import express from "express";
import ClassesController from "./controllers/ClassesControler";
import ConnectionsController from "./controllers/ConnectionsController";

const routes = express.Router();

const classesController = new ClassesController();
const connectionsController = new ConnectionsController();

routes.get("/classes", classesController.index);
routes.post("/classes", classesController.create);

routes.post("/connections", connectionsController.create);
routes.get("/connections", connectionsController.index);
routes.get("/connections/quantity", connectionsController.quantity);

export default routes;
