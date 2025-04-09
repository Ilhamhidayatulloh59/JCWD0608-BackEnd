import { Router } from "express";
import { PostController } from "../controllers/post.controller";
import { uploader } from "../helpers/uploader";
import { AuthMiddleware } from "../middleware/auth.middleware";

export class PostRouter {
  private router: Router;
  private postController: PostController;
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.postController = new PostController();
    this.authMiddleware = new AuthMiddleware();
    this.intializeRoute();
  }

  private intializeRoute() {
    this.router.get("/", this.postController.getPost);
    this.router.post(
      "/",
      uploader("diskStorage", "ig-").single("image"),
      this.authMiddleware.verifyToken,
      this.postController.createPost
    );
    this.router.post(
      "/cloud",
      uploader("memoryStorage", "ig-").single("image"),
      this.authMiddleware.verifyToken,
      this.postController.createPostCloud
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
