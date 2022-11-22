import { defineConfig } from "vite";
import { resolve } from "path";
import minifyHTML from "rollup-plugin-minify-html-literals";
import copy from "rollup-plugin-copy";

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		sourcemap: true,
		rollupOptions: {
			input: {
				index: resolve(__dirname, "index.html"),
				"theme-3way-switch": resolve(__dirname, "./src/main.ts"),
			},
			output: [
				// {
				// 	entryFileNames: "[name].js",
				// },
				{
					entryFileNames: "[name].js",
					dir: "docs",
				},
			],
			plugins: [
				minifyHTML.default(), // instead of minifyHTML(),
				copy({
					targets: [{ src: "docs/theme-3way-switch.*", dest: "dist" }],
				}),
			],
		},
	},
});
