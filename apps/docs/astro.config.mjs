import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightOpenAPI, { openAPISidebarGroups } from 'starlight-openapi';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// https://astro.build/config
export default defineConfig({
  outDir: 'dist',
  site: 'https://theo-matzavinos.github.io',
  base: '/state-management',
  integrations: [
    starlight({
      title: 'Server/Async State Management',
      plugins: [
        starlightOpenAPI([
          {
            base: 'api',
            label: 'Endpoints',
            schema: 'apps/backend/openapi.yml',
          },
        ]),
      ],
      sidebar: [
        {
          label: 'Intro',
          link: '/',
        },
        ...openAPISidebarGroups,
        {
          label: 'DTOs',
          link: '/dto',
        },
        {
          label: 'Store',
          autogenerate: { directory: 'store' },
        },
        {
          label: 'Query',
          autogenerate: { directory: 'query' },
        },
      ],
    }),
  ],
  vite: {
    plugins: [
      viteStaticCopy({
        targets: [
          {
            src: '../../libs/api/dto/src/*[!index].ts',
            dest: resolve(fileURLToPath(import.meta.url), '../snips/dto'),
          },
          {
            src: '../../apps/store/src/app/todos/*.ts',
            dest: resolve(fileURLToPath(import.meta.url), '../snips/store'),
          },
        ],
      }),
    ],
  },
});
