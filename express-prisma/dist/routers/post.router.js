"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRouter = void 0;
const express_1 = require("express");
const post_controller_1 = require("../controllers/post.controller");
const uploader_1 = require("../helpers/uploader");
const auth_middleware_1 = require("../middleware/auth.middleware");
class PostRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.postController = new post_controller_1.PostController();
        this.authMiddleware = new auth_middleware_1.AuthMiddleware();
        this.intializeRoute();
    }
    intializeRoute() {
        this.router.get("/", this.authMiddleware.verifyToken, this.postController.getPost);
        this.router.post("/like", this.authMiddleware.verifyToken, this.postController.likePost);
        this.router.post("/", (0, uploader_1.uploader)("diskStorage", "ig-").single("image"), this.authMiddleware.verifyToken, this.postController.createPost);
        this.router.post("/cloud", (0, uploader_1.uploader)("memoryStorage", "ig-").single("image"), this.authMiddleware.verifyToken, this.postController.createPostCloud);
    }
    getRouter() {
        return this.router;
    }
}
exports.PostRouter = PostRouter;
