import express, { Express, Request, Response } from "express";
import userRouter from "./routes/userRoutes";
import { errorHandler } from "./middleware/errorHandler";
import connectDb from "./config/dbConnection";

import dotenv from "dotenv";

dotenv.config();

connectDb();
const app: Express = express();

const port = process.env.PORT || 5001;

app.use(express.json());
app.use("/api/users", userRouter);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

export default app;
