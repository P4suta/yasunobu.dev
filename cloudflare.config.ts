import { defineConfig } from "cf/config";

export default defineConfig({
	worker: {
		name: "yasunobu-homepage",
		compatibilityDate: "2026-11-08",
		domains: ["sakashita.yasunobu.dev"],
		workersDev: false,
		previewUrls: false,
	},
});
