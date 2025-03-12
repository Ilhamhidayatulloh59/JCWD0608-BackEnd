import { NextFunction, Request, Response, Router } from "express";
import { UserController } from "../controllers/user.controller";

export class UserRouter {
  private router: Router;
  private userController: UserController;

  constructor() {
    this.router = Router();
    this.userController = new UserController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use((req: Request, res: Response, next: NextFunction) => {
      console.log("Time :", Date.now());
      next();
    });

    this.router.post("/", this.userController.createUser);
    this.router.get("/", this.userController.getUsers);
    this.router.get("/:id", this.userController.getUserById);
    this.router.patch("/:id", this.userController.updateUserById);
    this.router.delete("/:id", this.userController.deleteUserById);
    // add another route
  }

  getRouter(): Router {
    return this.router;
  }
}
