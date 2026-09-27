// Markdown ページの本文に学年別ルビを付ける rehype プラグイン
import { toSegments } from './furigana.mjs';

const SKIP = new Set(['code', 'pre', 'ruby', 'rt', 'rp', 'script', 'style', 'kbd']);

export default function rehypeGradeRuby() {
  return async (tree) => {
    const jobs = [];
    const walk = (node) => {
      if (!node.children) return;
      if (node.type === 'element' && (SKIP.has(node.tagName) || node.properties?.dataNoRuby !== undefined)) return;
      node.children.forEach((child, i) => {
        if (child.type === 'text' && /[\u3400-\u9FFF]/.test(child.value)) jobs.push({ parent: node, child });
        else walk(child);
      });
    };
    walk(tree);
    for (const { parent, child } of jobs) {
      const segs = await toSegments(child.value);
      const nodes = segs.map((s) =>
        s.type === 'text'
          ? { type: 'text', value: s.value }
          : {
              type: 'element',
              tagName: 'ruby',
              properties: { className: [`g${s.grade}`] },
              children: [
                { type: 'text', value: s.base },
                { type: 'element', tagName: 'rt', properties: {}, children: [{ type: 'text', value: s.reading }] },
              ],
            },
      );
      const idx = parent.children.indexOf(child);
      parent.children.splice(idx, 1, ...nodes);
    }
  };
}
