import { defineConfig } from "vite";
import { resolve } from "path";
import minifyHTML from 'rollup-plugin-minify-html-literals';

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		rollupOptions: {
            plugins: [
                minifyHTML.default(), // instead of minifyHTML(),
            ],
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