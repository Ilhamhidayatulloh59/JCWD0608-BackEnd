import { Router } from "express";
import { ExpenseController } from "../controllers/expense.controller";

export class ExpenseRouter {
  private router: Router;
  private expenseController: ExpenseController;

  constructor() {
    this.router = Router();
    this.expenseController = new ExpenseController();
    this.initializeRoute();
  }

  private initializeRoute() {
    this.router.get("/", this.expenseController.getExpense);
    this.router.post("/", this.expenseController.createExpense);

    this.router.get("/:id", this.expenseController.getExpenseId);
    this.router.patch("/:id", this.expenseController.updateExpense);
    this.router.delete("/:id", this.expenseController.deleteExpense);
  }

  getRouter(): Router {
    return this.router;
  }
}
