import express, { Express, Request, Response } from "express";

const app: Express = express();

const port = process.env.PORT || 5001;

app.use(express.json());

app.get("/api", (req: Request, res: Response) => {
  res.status(200).json({ message: "Hello boomers" });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

export default app;
