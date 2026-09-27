import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import rehypeRaw from 'rehype-raw';
import rehypeGradeRuby from './src/lib/rehype-grade-ruby.mjs';

// GitHub Pages: https://tmdoi.github.io/easy-microbit/
export default defineConfig({
  site: 'https://tmdoi.github.io',
  base: '/easy-microbit',
  trailingSlash: 'always',
  markdown: {
    // Markdown 本文に学年別ルビを付ける
    // rehype-raw で Markdown 中の HTML（<details> など）も解析してからルビを付ける
    processor: unified({ rehypePlugins: [rehypeRaw, rehypeGradeRuby] }),
  },
});
