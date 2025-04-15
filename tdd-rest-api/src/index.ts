import express, { Application, Request, Response } from "express";
import { UserRouter } from "./routers/user.router";
import { PokemonRouter } from "./routers/pokemon.router";

const PORT: number = 8000;

const app: Application = express();
app.use(express.json());

app.get("/api", (req: Request, res: Response) => {
  res.status(200).send("welcome to my API");
});

const userRouter = new UserRouter();
app.use("/api/users", userRouter.getRouter());

const pokeRouter = new PokemonRouter();
app.use("/api/pokemons", pokeRouter.getRouter());

app.listen(PORT, () => {
  console.log(`server running on : http://localhost:${PORT}/api`);
});

export default app;
