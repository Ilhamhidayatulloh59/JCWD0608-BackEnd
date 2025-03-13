import { Request, Response } from "express";
import fs from "fs";
import { IExpense } from "../type";

export class ExpenseController {
  getExpense(req: Request, res: Response) {
    const { category, start, end, type } = req.query;
    let expense: IExpense[] = JSON.parse(
      fs.readFileSync("./data/expense.json", "utf-8")
    );

    expense = expense.filter((item) => {
      let isValid: boolean = true;
      if (category) isValid = isValid && item.category == category;
      if (type) isValid = isValid && item.type == type;
      if (start && end) {
        const startDate = new Date(start as string);
        const endDate = new Date(end as string);
        const expenseDate = new Date(item.date);
        isValid = isValid && expenseDate >= startDate && expenseDate <= endDate;
      }

      return isValid;
    });

    const total_expense = expense
      .filter((item) => item.type == "expense")
      .reduce((a, b) => a + b.nominal, 0);
      
    const total_income = expense
      .filter((item) => item.type == "income")
      .reduce((a, b) => a + b.nominal, 0);

    res.status(200).send({
      message: "Expense Data ✅",
      total_expense,
      total_income,
      data: expense,
    });
  }
  getExpenseId(req: Request, res: Response) {
    const { id } = req.params;
    const expense: IExpense[] = JSON.parse(
      fs.readFileSync("./data/expense.json", "utf-8")
    );

    const data = expense.find((item) => item.id == +id);
    if (!data) {
      res.status(400).send({ message: "Expense not found 🚫" });
      return;
    }

    res.status(200).send({
      message: "Expense Detail ✅",
      data,
    });
  }
  createExpense(req: Request, res: Response) {
    const { title, nominal, type, category, date } = req.body;
    const expense: IExpense[] = JSON.parse(
      fs.readFileSync("./data/expense.json", "utf-8")
    );

    const maxId =
      expense.length == 0 ? 0 : Math.max(...expense.map((item) => item.id));
    const id = maxId + 1;

    const newExpense: IExpense = { id, title, nominal, type, category, date };
    expense.push(newExpense);

    fs.writeFileSync("./data/expense.json", JSON.stringify(expense), "utf-8");

    res.status(201).send({
      message: "Create expenses successfully ✅",
    });
  }
  deleteExpense(req: Request, res: Response) {
    const { id } = req.params;
    const expense: IExpense[] = JSON.parse(
      fs.readFileSync("./data/expense.json", "utf-8")
    );
    const idx = expense.findIndex((item) => item.id == +id);

    if (idx < 0) {
      res.status(400).send({ message: "Expense not found 🚫" });
      return;
    }
    expense.splice(idx, 1);
    fs.writeFileSync("./data/expense.json", JSON.stringify(expense), "utf-8");

    res.status(200).send({ message: `Expense with id ${id} deleted ✅` });
  }
  updateExpense(req: Request, res: Response) {
    const { id } = req.params;
    const expense: IExpense[] = JSON.parse(
      fs.readFileSync("./data/expense.json", "utf-8")
    );
    const idx = expense.findIndex((item) => item.id == +id);

    if (idx < 0) {
      res.status(400).send({ message: "Expense not found 🚫" });
      return;
    }

    const field = ["title", "nominal", "type", "category", "date"];
    const isValid = Object.keys(req.body).every((key) => field.includes(key));
    if (!isValid) {
      res.status(400).send({ message: "Invalid field in body 🚫" });
    }

    expense[idx] = { ...expense[idx], ...req.body };
    fs.writeFileSync("./data/expense.json", JSON.stringify(expense), "utf-8");

    res.status(200).send({ message: `Expense with id ${id} updated ✅` });
  }
}
