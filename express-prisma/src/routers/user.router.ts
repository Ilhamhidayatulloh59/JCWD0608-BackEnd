import { Router } from "express";
import { UserController } from "../controllers/user.controller";

export class UserRouter {
  private router: Router;
  private userController: UserController;

  constructor() {
    this.router = Router();
    this.userController = new UserController();
    this.initializeRoute();
  }

  private initializeRoute() {
    this.router.get("/", this.userController.getUser);
    this.router.post("/", this.userController.createUser);

    this.router.get("/:id", this.userController.getUserId);
    this.router.patch("/:id", this.userController.updateUser);
    this.router.delete("/:id", this.userController.deleteUser);
    this.router.get("/:id/post", this.userController.getUserPost)
  }

  getRouter(): Router {
    return this.router;
  }
}
