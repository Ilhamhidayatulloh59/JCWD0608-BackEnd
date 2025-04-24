"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
class UserRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.userController = new user_controller_1.UserController();
        this.authMiddleware = new auth_middleware_1.AuthMiddleware();
        this.initializeRoute();
    }
    initializeRoute() {
        this.router.get("/", this.authMiddleware.verifyToken, this.userController.getUser);
        this.router.get("/redis", this.userController.getUserRedis);
        this.router.get("/post", this.authMiddleware.verifyToken, this.userController.getUserPost);
        this.router.patch("/", this.authMiddleware.verifyToken, this.userController.updateUser);
        this.router.get("/:id", this.userController.getUserId);
        this.router.delete("/:id", this.authMiddleware.verifyToken, this.authMiddleware.verifyAdmin, this.userController.deleteUser);
    }
    getRouter() {
        return this.router;
    }
}
exports.UserRouter = UserRouter;
