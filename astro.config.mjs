import { defineConfig } from 'astro/config';

const site = process.env.SITE_URL || 'https://jaimequinterosicre.com';

export default defineConfig({
  site,
  integrations: [],
  // Avoid the development toolbar's unavailable audit dependencies locally.
  devToolbar: { enabled: false },
  vite: {
    plugins: [{
      name: 'skip-disabled-toolbar-prebundling',
      // Astro 4 adds these even when its development toolbar is disabled.
      configResolved(config) {
        config.optimizeDeps.include = (config.optimizeDeps.include ?? []).filter(
          (dependency) => !['astro > aria-query', 'astro > axobject-query'].includes(dependency),
        );
      },
    }],
  },
});
