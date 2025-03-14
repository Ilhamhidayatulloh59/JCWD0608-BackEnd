import express, { Application, Request, Response } from "express";
import { ExpenseRouter } from "./routers/expense.router";
import pool from "./config/db";
import "dotenv/config";
import { ExpenseRouterV2 } from "./routers/expenseV2.router";

const PORT: number = 8000;

const app: Application = express();
app.use(express.json());

app.get("/api", (req: Request, res: Response) => {
  res.status(200).send({ message: "Expense api ✅" });
});

const expenseRouter = new ExpenseRouter();
app.use("/api/expense", expenseRouter.getRouter());

const expenseRouterV2 = new ExpenseRouterV2();
app.use("/api/v2/expense", expenseRouterV2.getRouter());

pool.connect((err, client, release) => {
  if (err) {
    return console.log("Error acquiring client", err.stack);
  }
  console.log("Success connection");
  release();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/api`);
});
