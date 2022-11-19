import { defineConfig } from "vite";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		rollupOptions: {
			input: {
                index: resolve(__dirname, "index.html"),
				"theme-switch": resolve(__dirname, "./src/main.ts"),
			},
			output: {
				entryFileNames: "[name].js",
			},
		},
	},
});