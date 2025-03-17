import { Request, Response } from "express";
import pool from "../config/db";

export class ExpenseControllerV2 {
  async getExpense(req: Request, res: Response) {
    try {
      const limit = 3;
      const page = parseInt(req.query.page as string) || 1;
      const offset = (page - 1) * limit;
      const { rowCount } = await pool.query("select * from expense");
      const { rows } = await pool.query(
        `select * from expense order by id asc limit ${limit} offset ${offset}`
      );

      res.status(200).send({
        message: "Data Expense ✅",
        data: rows,
        meta: {
          total: rowCount,
          page: page,
          limit: limit,
          totalPage: Math.ceil(rowCount! / limit),
        },
      });
    } catch (err) {
      console.log(err)
      res.status(400).send(err);
    }
  }

  async getExpenseId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { rows, rowCount } = await pool.query(
        `select * from expense where id = ${id}`
      );
      if (!rowCount) {
        res.status(400).send({ message: "Expense not found !" });
        return;
      }
      res.status(200).send({
        message: "Expense Detail",
        data: rows[0],
      });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
  async createExpense(req: Request, res: Response) {
    try {
      const { title, nominal, type, category, date } = req.body;
      await pool.query(
        `insert into expense (title, nominal, type, category, date) values ('${title}', ${nominal}, '${type}', '${category}', '${date}')`
      );
      res.status(201).send({ message: "Expense created !" });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
  async editExpense(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const query: string[] = [];
      for (let key in req.body) {
        query.push(`${key} = '${req.body[key]}'`);
      }

      await pool.query(
        `update expense set ${query.join(", ")} where id = ${id}`
      );

      res.status(200).send({ message: "Expense updated !" });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
  async deleteExpense(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await pool.query(`delete from expense where id = ${id}`);
      res.status(200).send({ message: "Expense deleted !" });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
}
