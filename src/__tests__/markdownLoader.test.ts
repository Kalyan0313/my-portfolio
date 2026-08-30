import { describe, it, expect } from 'vitest';
import { parseMarkdownFile } from '../utils/markdownLoader';

describe('Markdown Loader & Frontmatter Parser', () => {
  it('correctly parses frontmatter metadata and compiles HTML body', () => {
    const rawMarkdown = `---
id: test-article
title: "Testing Architecture in Node.js"
date: "Aug 2026"
readTime: "5 min read"
topic: "Testing"
featured: true
tags:
  - Vitest
  - Testing
summary: "A practical guide to unit and integration testing."
keyTakeaways:
  - "Takeaway 1: Test behaviors."
  - "Takeaway 2: Avoid brittle tests."
---

# 1. Introduction to Testing

Here is some text with a code snippet:

\`\`\`typescript
const add = (a: number, b: number): number => a + b;
\`\`\`
`;

    const note = parseMarkdownFile(rawMarkdown, 'fallback-id');

    expect(note.id).toBe('test-article');
    expect(note.title).toBe('Testing Architecture in Node.js');
    expect(note.date).toBe('Aug 2026');
    expect(note.readTime).toBe('5 min read');
    expect(note.topic).toBe('Testing');
    expect(note.featured).toBe(true);
    expect(note.tags).toEqual(['Vitest', 'Testing']);
    expect(note.keyTakeaways).toHaveLength(2);
    expect(note.htmlContent).toContain('<h1 id="1-introduction-to-testing">');
    expect(note.htmlContent).toContain('<code class="hljs typescript">');
  });

  it('handles unescaped internal quotes cleanly', () => {
    const rawWithQuotes = `---
id: quotes-test
title: "The Difference Between \\"Working Code\\" and Production-Ready Code"
date: "Aug 2026"
---

# Title
`;

    const note = parseMarkdownFile(rawWithQuotes, 'quotes-test');
    expect(note.title).toBe('The Difference Between "Working Code" and Production-Ready Code');
  });
});
