import { defineConfig } from "vite";
import { resolve } from "path";
import minifyHTML from "rollup-plugin-minify-html-literals";

// TODO: auto remove console.log from build
// TODO: improve how docs are generated

// https://vitejs.dev/config/
export default defineConfig({
	esbuild: {
		// drop: ["console", "debugger"],
	},
	build: {
		sourcemap: true,
		modulePreload: {
			polyfill: false,
		},
		rollupOptions: {
			input: {
				index: resolve(__dirname, "index.html"),
				"theme-multi-switch": resolve(__dirname, "./src/main.ts"),
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
				minifyHTML.default({
					options: {
						shouldMinify(template) {
							return template.parts.some((part) => {
								// Matches Polymer templates that are not tagged
								return part.text.includes("<style") || part.text.includes("<div");
							});
						},
					},
				}),
			],
		},
	},
});
