import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Highlight from '@tiptap/extension-highlight';
import { TaskItem } from '@tiptap/extension-task-item';
import { TaskList } from '@tiptap/extension-task-list';
import Link from '@tiptap/extension-link';

export const basicExts = [
  StarterKit,
  Underline,
  TextAlign,
  Subscript,
  Superscript,
  Highlight,
  TaskList,
  TaskItem,
  Link,
];
