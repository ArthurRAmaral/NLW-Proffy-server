import express from "express";
import cors from "cors";
import { config } from "dotenv";

import routes from "./routes";

config();

const PORT = process.env.PORT || 3333;

const app = express();

app.use(cors());

app.use(express.json());

app.use(routes);

app.listen(PORT, () => {
  console.log(`Listem port ${PORT}`);
});
