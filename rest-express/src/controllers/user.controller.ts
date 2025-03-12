import { Request, Response } from "express";
import fs from "fs";
import { IUser } from "../type";

export class UserController {
  getUsers(req: Request, res: Response) {
    const { name } = req.query;

    let users: IUser[] = JSON.parse(
      fs.readFileSync("./data/user.json", "utf-8")
    );

    if (name) {
      users = users.filter((item) => item.name.includes(name as string));
    }

    res.status(200).send({
      message: "Users Data",
      data: users,
    });
  }
  getUserById(req: Request, res: Response) {
    const { id } = req.params;
    const users: IUser[] = JSON.parse(
      fs.readFileSync("./data/user.json", "utf-8")
    );
    const user: IUser | undefined = users.find((item) => item.id == +id);

    if (!user) {
      res.status(400).send({ message: "User not found!" });
      return;
    }

    res.status(200).send({
      message: `User Data with id ${id}`,
      data: user,
    });
  }
  createUser(req: Request, res: Response) {
    const { name, email } = req.body;
    const users: IUser[] = JSON.parse(
      fs.readFileSync("./data/user.json", "utf-8")
    );
    const maxId = Math.max(...users.map((item) => item.id)) || 0;
    const id = maxId + 1;
    const newUser: IUser = { id, name, email };
    users.push(newUser);
    fs.writeFileSync("./data/user.json", JSON.stringify(users), "utf-8");

    res.status(201).send({
      message: "Create User Successfully!",
    });
  }
  deleteUserById(req: Request, res: Response) {
    const { id } = req.params;
    const users: IUser[] = JSON.parse(
      fs.readFileSync("./data/user.json", "utf-8")
    );
    const idx = users.findIndex((item) => item.id == +id);
    if (idx == -1) {
      res.status(400).send({ message: "User not found!" });
      return;
    }
    users.splice(idx, 1);
    fs.writeFileSync("./data/user.json", JSON.stringify(users), "utf-8");

    res.status(200).send({
      message: `User with id ${id} has been deleted!`,
    });
  }
  updateUserById(req: Request, res: Response) {
    const { id } = req.params;
    const users: IUser[] = JSON.parse(
      fs.readFileSync("./data/user.json", "utf-8")
    );

    const idx = users.findIndex((item) => item.id == +id);
    if (idx == -1) {
      res.status(400).send({ message: "User not found!" });
      return;
    }

    const fields = ["name", "email"];
    const isValid = Object.keys(req.body).every((key) => fields.includes(key));
    if (!isValid) {
      res.status(400).send({ message: "Invalid Field in body" });
      return;
    }

    users[idx] = { ...users[idx], ...req.body };
    fs.writeFileSync("./data/user.json", JSON.stringify(users), "utf-8");

    res.status(200).send({
      message: `User with id ${id} has been updated!`,
    });
  }
}
