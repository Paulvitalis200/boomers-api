import express, { Express, Request, Response } from "express";
import userRouter from "./routes/userRoutes";

import { errorHandler } from "./middleware/errorHandler";
import connectDb from "./config/dbConnection";
import swaggerDocs from "./swagger";

import dotenv from "dotenv";
import userProfileRouter from "./routes/userProfileRoutes";
import teamRouter from "./routes/team/teamRoutes";
import teamMemberRouter from "./routes/team/teamMemberRoutes";

dotenv.config();

connectDb();
const app: Express = express();

const port = process.env.PORT || 5001;

app.use(express.json());
app.use("/api/users", [userRouter, userProfileRouter]);
app.use("/api/teams", teamRouter);
app.use("/api/team-member", teamMemberRouter);
app.use(errorHandler);
app.disable("x-powered-by"); // less hackers know about our stack

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

swaggerDocs(app, port);

export default app;
