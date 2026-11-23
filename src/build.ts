import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { toSSG } from "hono/ssg";
import { app } from "./app.js";

const dist = fileURLToPath(new URL("../dist", import.meta.url));
const publicFiles = fileURLToPath(new URL("../public", import.meta.url));

await fs.rm(dist, { recursive: true, force: true });
await fs.cp(publicFiles, dist, { recursive: true });

const result = await toSSG(app, fs, { dir: dist });
if (!result.success) throw result.error;
