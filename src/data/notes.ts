import { loadAllBlogNotes } from '../utils/markdownLoader';
import type { EngineeringNote } from '../types';

/**
 * Automatically loads all engineering notes & technical blogs from Markdown files in `src/content/blogs/*.md`.
 * To add a new article: Simply create a new `.md` file in `src/content/blogs/` with frontmatter!
 */
export const engineeringNotesData: EngineeringNote[] = loadAllBlogNotes();
