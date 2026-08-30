import { marked, Renderer } from 'marked';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import sql from 'highlight.js/lib/languages/sql';
import json from 'highlight.js/lib/languages/json';
import bash from 'highlight.js/lib/languages/bash';
import python from 'highlight.js/lib/languages/python';
import type { EngineeringNote } from '../types';

// Register essential language definitions
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('js', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('ts', typescript);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('json', json);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('sh', bash);
hljs.registerLanguage('python', python);
hljs.registerLanguage('py', python);

// Custom renderer to assign clean ID anchors to headings and multi-colored syntax highlighting to code
const customRenderer = new Renderer();

customRenderer.heading = function ({ tokens, depth }: any) {
  const text = this.parser.parseInline(tokens);
  const plainText = text.replace(/<[^>]*>/g, '').trim();
  const slug = plainText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return `<h${depth} id="${slug}">${text}</h${depth}>\n`;
};

customRenderer.code = function ({ text, lang }: { text: string; lang?: string }) {
  if (lang === 'mermaid') {
    return `<div class="mermaid-container"><div class="mermaid">${text}</div></div>\n`;
  }

  const language = lang && hljs.getLanguage(lang) ? lang : '';
  let highlighted = '';

  try {
    if (language) {
      highlighted = hljs.highlight(text, { language, ignoreIllegals: true }).value;
    } else {
      highlighted = hljs.highlightAuto(text).value;
    }
  } catch {
    highlighted = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  const langTag = language ? `<span class="code-lang-badge">${language.toUpperCase()}</span>` : '';
  return `<div class="code-block-wrapper">${langTag}<pre><code class="hljs ${language}">${highlighted}</code></pre></div>\n`;
};

marked.setOptions({
  renderer: customRenderer,
  gfm: true,
  breaks: true,
});

/**
 * Parses frontmatter YAML block from a raw markdown string.
 */
export function parseMarkdownFile(rawContent: string, fallbackId: string): EngineeringNote {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
  const match = rawContent.match(frontmatterRegex);

  let meta: Record<string, any> = {};
  let bodyMarkdown = rawContent;

  if (match) {
    const yamlString = match[1];
    bodyMarkdown = match[2].trim();

    // Parse simple YAML lines
    const lines = yamlString.split('\n');
    let currentKey = '';
    let isArray = false;

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;

      if (trimmed.startsWith('- ') && currentKey && isArray) {
        const itemVal = trimmed.replace(/^- \s*/, '').replace(/^["']|["']$/g, '').replace(/\\"/g, '"');
        meta[currentKey].push(itemVal);
        return;
      }

      const colonIdx = line.indexOf(':');
      if (colonIdx !== -1) {
        const key = line.slice(0, colonIdx).trim();
        const value = line.slice(colonIdx + 1).trim();

        if (!value) {
          // Key with nested array or block
          currentKey = key;
          isArray = true;
          meta[key] = [];
        } else if (value.startsWith('[') && value.endsWith(']')) {
          // Inline JSON-like array [a, b, c]
          currentKey = key;
          isArray = false;
          meta[key] = value
            .slice(1, -1)
            .split(',')
            .map((s) => s.trim().replace(/^["']|["']$/g, '').replace(/\\"/g, '"'))
            .filter(Boolean);
        } else {
          currentKey = key;
          isArray = false;
          if (value.toLowerCase() === 'true') meta[key] = true;
          else if (value.toLowerCase() === 'false') meta[key] = false;
          else meta[key] = value.replace(/^["']|["']$/g, '').replace(/\\"/g, '"').replace(/\\'/g, "'");
        }
      }
    });
  }

  const html = marked.parse(bodyMarkdown) as string;

  return {
    id: meta.id || fallbackId,
    title: meta.title || fallbackId.replace(/-/g, ' ').toUpperCase(),
    date: meta.date || 'Technical Note',
    readTime: meta.readTime || '5 min read',
    topic: meta.topic || 'Engineering',
    featured: Boolean(meta.featured),
    tags: Array.isArray(meta.tags) ? meta.tags : [],
    summary: meta.summary || bodyMarkdown.slice(0, 160) + '...',
    keyTakeaways: Array.isArray(meta.keyTakeaways) ? meta.keyTakeaways : [],
    contentMarkdown: bodyMarkdown,
    htmlContent: html
  };
}

/**
 * Automatically loads and compiles all .md files in src/content/blogs/ using Vite glob
 */
export function loadAllBlogNotes(): EngineeringNote[] {
  const blogModules = import.meta.glob('/src/content/blogs/*.md', {
    eager: true,
    query: '?raw',
    import: 'default'
  }) as Record<string, string>;

  const notes: EngineeringNote[] = [];

  for (const [path, rawContent] of Object.entries(blogModules)) {
    const filename = path.split('/').pop()?.replace('.md', '') || 'note';
    const note = parseMarkdownFile(rawContent, filename);
    notes.push(note);
  }

  // Sort notes: featured first, then standard order
  return notes.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
}
