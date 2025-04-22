import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { AuthMiddleware } from "../middleware/auth.middleware";

export class OrderRouter {
  private router: Router;
  private orderController: OrderController;
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.orderController = new OrderController();
    this.authMiddleware = new AuthMiddleware();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      "/",
      this.authMiddleware.verifyToken,
      this.orderController.createOrder
    );
    this.router.post("/status", this.orderController.updateStatus);
  }

  getRouter(): Router {
    return this.router;
  }
}
