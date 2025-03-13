import express, { Application, Request, Response } from "express";
import { ExpenseRouter } from "./routers/expense.router";

const PORT: number = 8000;

const app: Application = express();
app.use(express.json());

app.get("/api", (req: Request, res: Response) => {
  res.status(200).send({ message: "Expense api ✅" });
});

const expenseRouter = new ExpenseRouter();
app.use("/api/expense", expenseRouter.getRouter());

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/api`);
});
