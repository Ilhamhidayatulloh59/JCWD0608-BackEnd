import { Router } from "express";
import { ExpenseControllerV2 } from "../controllers/expenseV2.controller";

export class ExpenseRouterV2 {
  private router: Router;
  private expenseControllerV2: ExpenseControllerV2;

  constructor() {
    this.router = Router();
    this.expenseControllerV2 = new ExpenseControllerV2();
    this.initializeRoute();
  }

  private initializeRoute() {
    this.router.get("/", this.expenseControllerV2.getExpense);
  }

  getRouter(): Router {
    return this.router;
  }
}
