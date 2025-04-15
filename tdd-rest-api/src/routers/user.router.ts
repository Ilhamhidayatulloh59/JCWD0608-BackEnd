import { Request, Response, Router } from "express";
import prisma from "../prisma";

export class UserRouter {
  private router: Router;

  constructor() {
    this.router = Router();
    this.intializeRoutes();
  }

  private intializeRoutes() {
    this.router.get("/", async (req: Request, res: Response) => {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      });
      res.status(200).send({
        message: "ok",
        users,
      });
    });
  }

  getRouter(): Router {
    return this.router;
  }
}
