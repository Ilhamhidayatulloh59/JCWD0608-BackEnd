import { Request, Response } from "express";
import prisma from "../prisma";
import { cloudinaryUpload } from "../helpers/cloudinary";

export class PostController {
  async getPost(req: Request, res: Response) {
    try {
      const posts = await prisma.post.findMany({
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
        },
        orderBy: { createdAt: "desc" },
      });

      res.status(200).send({
        message: "Data Post",
        posts,
      });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async createPost(req: Request, res: Response) {
    try {
      if (!req.file) throw { message: "Image empty" };
      const { caption } = req.body;
      const imageUrl = `http://localhost:8000/api/public/${req.file.filename}`;

      await prisma.post.create({
        data: { imageUrl, caption, userId: req.user?.id! },
      });

      res.status(201).send({
        message: "Post created",
      });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async createPostCloud(req: Request, res: Response) {
    try {
      if (!req.file) throw { message: "image empty" };
      const { caption } = req.body;
      const { secure_url } = await cloudinaryUpload(req.file, "ig");

      await prisma.post.create({
        data: { imageUrl: secure_url, caption, userId: req.user?.id! },
      });

      res.status(201).send({
        message: "Post created",
        secure_url,
      });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
}
