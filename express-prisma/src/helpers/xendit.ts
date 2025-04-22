import { Xendit } from "xendit-node";

const xendit = new Xendit({
  secretKey: process.env.XENDIT_API_KEY!,
});

export default xendit;
