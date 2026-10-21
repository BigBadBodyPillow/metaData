import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig(({ command }) => {
  // Applies '/metaData' base path only when building for production
  const base = command === 'build' ? '/metaData' : '';

  return {
    plugins: [
      sveltekit({
        compilerOptions: {
          // Force runes mode for the project, except for libraries. Can be removed in svelte 6.
          runes: ({ filename }) =>
            filename.split(/[/\\]/).includes('node_modules') ? undefined : true
        },

        adapter: adapter({
          pages: 'build',
          assets: 'build',
          fallback: '404.html', // Essential for Single Page App (SPA) fallback routing
          precompress: false,
          strict: true
        })
      })
    ],
    kit: {
      paths: {
        base
      }
    }
  };
});
