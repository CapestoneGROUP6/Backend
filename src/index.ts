import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { authRouter } from "./routes/authRoutes";
import bodyParser from "body-parser";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());


app.get("/health", (req: Request, res: Response) => {
  res.send("Running");
});

app.use('/auth', authRouter);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
