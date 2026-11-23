import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { Home } from "./pages/index.js";

export const app = new Hono();

app.use(jsxRenderer());
app.get("/", (c) => c.render(<Home />));
