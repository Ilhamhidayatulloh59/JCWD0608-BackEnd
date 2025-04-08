import { Request, Response } from "express";
import prisma from "../prisma";

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
}
