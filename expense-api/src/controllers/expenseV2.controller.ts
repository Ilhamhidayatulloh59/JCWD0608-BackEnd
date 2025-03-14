import { Request, Response } from "express";
import pool from "../config/db";

export class ExpenseControllerV2 {
  async getExpense(req: Request, res: Response) {
    try {
      const { rows } = await pool.query(
        "select * from expense order by id asc"
      );

      res.status(200).send({
        message: "Data Expense ✅",
        data: rows,
      });
    } catch (err) {
      res.status(400).send(err);
    }
  }
}
