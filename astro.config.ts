import cloudflare from "@astrojs/cloudflare";
import { defineConfig } from "astro/config";

export default defineConfig({
	site: "https://sakashita.yasunobu.dev",
	output: "static",
	adapter: cloudflare({ imageService: "passthrough" }),
	session: false,
});
