import glsl from 'vite-plugin-glsl';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [glsl()],
    assetsInclude: ['**/*.glb'],
    server: {
        hmr: {
            overlay: true // Optional: Keep this true to show error overlays, or set to false to disable
        }
    }
});