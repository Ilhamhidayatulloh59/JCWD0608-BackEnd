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
exports.PostController = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const cloudinary_1 = require("../helpers/cloudinary");
class PostController {
    getPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const posts = yield prisma_1.default.post.findMany({
                    // include: { user: true },
                    select: {
                        id: true,
                        imageUrl: true,
                        caption: true,
                        createdAt: true,
                        updatedAt: true,
                        user: {
                            select: {
                                username: true,
                                email: true,
                                avatar: true,
                            },
                        },
                        _count: {
                            select: {
                                Like: true,
                            },
                        },
                    },
                    orderBy: { createdAt: "desc" },
                });
                const userLike = yield prisma_1.default.like.findMany({
                    where: { userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id },
                });
                const likedPost = new Set(userLike.map((item) => item.postId));
                const result = posts.map((post) => {
                    return Object.assign(Object.assign({}, post), { liked: likedPost.has(post.id), likeCount: post._count.Like });
                });
                res.status(200).send({
                    message: "Data Post",
                    posts: result,
                });
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
    createPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                if (!req.file)
                    throw { message: "Image empty" };
                const { caption } = req.body;
                const imageUrl = `http://localhost:8000/api/public/${req.file.filename}`;
                yield prisma_1.default.post.create({
                    data: { imageUrl, caption, userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id },
                });
                res.status(201).send({
                    message: "Post created",
                });
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
    createPostCloud(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                if (!req.file)
                    throw { message: "image empty" };
                const { caption } = req.body;
                const { secure_url } = yield (0, cloudinary_1.cloudinaryUpload)(req.file, "ig");
                yield prisma_1.default.post.create({
                    data: { imageUrl: secure_url, caption, userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id },
                });
                res.status(201).send({
                    message: "Post created",
                    secure_url,
                });
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
    likePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const { postId } = req.body;
                const isLike = yield prisma_1.default.like.findUnique({
                    where: {
                        postId_userId: {
                            postId,
                            userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
                        },
                    },
                });
                if (isLike) {
                    // unlike
                    yield prisma_1.default.like.delete({
                        where: {
                            postId_userId: {
                                postId,
                                userId: (_b = req.user) === null || _b === void 0 ? void 0 : _b.id,
                            },
                        },
                    });
                    res.status(200).send({ liked: false });
                }
                else {
                    // like
                    yield prisma_1.default.like.create({
                        data: {
                            postId,
                            userId: (_c = req.user) === null || _c === void 0 ? void 0 : _c.id,
                        },
                    });
                    res.status(200).send({ liked: true });
                }
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
}
exports.PostController = PostController;
