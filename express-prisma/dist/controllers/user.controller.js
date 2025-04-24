"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const redis_1 = require("../helpers/redis");
class UserController {
    getUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { search } = req.query;
                const filter = {};
                if (search) {
                    filter.username = { contains: search };
                }
                const users = yield prisma_1.default.user.findMany({
                    where: filter,
                    orderBy: { id: "asc" },
                    // take: 2,
                    // skip: 2,
                });
                const stats = yield prisma_1.default.user.aggregate({
                    _count: { _all: true },
                    _max: { createdAt: true },
                    _min: { createdAt: true },
                });
                res.status(200).send({
                    message: "User data",
                    users,
                    stats,
                });
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
    getUserId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const user = yield prisma_1.default.user.findUnique({ where: { id: +id } });
                if (!user)
                    throw { message: "User not found" };
                res.status(200).send({
                    message: "User detail",
                    user,
                });
            }
            catch (err) {
                res.status(400).send(err);
            }
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const data = req.body;
                yield prisma_1.default.user.update({ where: { id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id }, data });
                res.status(200).send({
                    message: "User updated ✅",
                });
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield prisma_1.default.user.delete({ where: { id: +id } });
                res.status(200).send({
                    message: "User deleted ✅",
                });
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
    getUserPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const user = yield prisma_1.default.user.findUnique({
                    where: { id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id },
                    include: { Post: true },
                });
                res.status(200).send({ user });
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
    getUserRedis(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const redisData = yield redis_1.redis.get("users");
                if (redisData) {
                    res.status(200).send({ users: JSON.parse(redisData) });
                    return;
                }
                const users = yield prisma_1.default.user.findMany();
                yield redis_1.redis.setex("users", 60, JSON.stringify(users));
                res.status(200).send({ users });
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
}
exports.UserController = UserController;
