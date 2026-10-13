'use client';

import { useEffect, useRef, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import {
  AlignCenter, AlignLeft, AlignRight, Bold, Code, Code2, FileCode, Heading2, Heading3, ImagePlus, Italic, Link2, List, ListOrdered,
  Minus, Pilcrow, Quote, Redo2, Strikethrough, Underline as UnderlineIcon, Undo2, Unlink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { MediaPicker } from './Media';

function Btn({ onClick, active, disabled, title, children }) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={cn('grid h-8 w-8 place-items-center rounded-lg text-ink-500 transition hover:bg-ink-100 hover:text-ink-900 disabled:opacity-30 dark:text-ink-400 dark:hover:bg-white/10 dark:hover:text-white', active && 'bg-brand-50 text-brand-600 dark:bg-brand-500/20 dark:text-brand-200')}
    >
      {children}
    </button>
  );
}

const Sep = () => <span className="mx-1 h-5 w-px bg-ink-200 dark:bg-white/10" />;

// stickyClass: where the toolbar sticks — below the admin top bar on full pages, at the top inside scrolling panels.
export default function RichEditor({ value, onChange, placeholder = 'Start writing your story…', minimal, className, stickyClass = 'top-16' }) {
  const [source, setSource] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const sourceRef = useRef(null);

  // The HTML source view grows with its content instead of being a fixed-height box.
  useEffect(() => {
    const el = sourceRef.current;
    if (!source || !el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.max(320, el.scrollHeight)}px`;
  }, [source, value]);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4] } }),
      Underline,
      Link.configure({ openOnClick: false, autolink: true }),
      Image,
      Placeholder.configure({ placeholder }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: value || '',
    editorProps: { attributes: { class: 'prose prose-slate dark:prose-invert max-w-none prose-headings:font-extrabold prose-a:text-brand-600 prose-img:rounded-xl focus:outline-none px-5 py-4' } },
    onUpdate: ({ editor: ed }) => onChange(ed.isEmpty ? '' : ed.getHTML()),
  });

  // Sync external value changes (e.g. loading a post) without clobbering the cursor while typing.
  useEffect(() => {
    if (editor && !editor.isFocused && value !== editor.getHTML()) editor.commands.setContent(value || '', false);
  }, [value, editor]);

  if (!editor) return <div className="min-h-[320px] animate-pulse rounded-xl border border-ink-200 bg-ink-50 dark:border-white/10 dark:bg-white/5" />;

  const setLink = () => {
    const prev = editor.getAttributes('link').href;
    const url = window.prompt('Link URL', prev || 'https://');
    if (url === null) return;
    if (url === '') editor.chain().focus().unsetLink().run();
    else editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    // No overflow clipping on the wrapper: it would turn the editor into a hidden scroll container
    // (content scrolled out of reach while typing) and stop the toolbar from sticking.
    <div className={cn('rounded-xl border border-ink-200 bg-white focus-within:border-brand-400 focus-within:ring-4 focus-within:ring-brand-500/10 dark:border-white/10 dark:bg-ink-950/40', className)}>
      <div className={cn('sticky z-10 flex flex-wrap items-center gap-0.5 rounded-t-xl border-b border-ink-100 bg-white/95 px-2 py-1.5 backdrop-blur dark:border-white/5 dark:bg-ink-900/95', stickyClass)}>
        {!minimal && (
          <>
            <Btn title="Paragraph" active={editor.isActive('paragraph')} onClick={() => editor.chain().focus().setParagraph().run()}><Pilcrow className="h-4 w-4" /></Btn>
            <Btn title="Heading 2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 className="h-4 w-4" /></Btn>
            <Btn title="Heading 3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 className="h-4 w-4" /></Btn>
            <Sep />
          </>
        )}
        <Btn title="Bold (Ctrl+B)" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><Bold className="h-4 w-4" /></Btn>
        <Btn title="Italic (Ctrl+I)" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic className="h-4 w-4" /></Btn>
        <Btn title="Underline (Ctrl+U)" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}><UnderlineIcon className="h-4 w-4" /></Btn>
        <Btn title="Strikethrough" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}><Strikethrough className="h-4 w-4" /></Btn>
        <Btn title="Inline code" active={editor.isActive('code')} onClick={() => editor.chain().focus().toggleCode().run()}><Code className="h-4 w-4" /></Btn>
        <Sep />
        <Btn title="Bullet list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}><List className="h-4 w-4" /></Btn>
        <Btn title="Numbered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered className="h-4 w-4" /></Btn>
        <Btn title="Quote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote className="h-4 w-4" /></Btn>
        {!minimal && <Btn title="Code block" active={editor.isActive('codeBlock')} onClick={() => editor.chain().focus().toggleCodeBlock().run()}><Code2 className="h-4 w-4" /></Btn>}
        <Btn title="Divider" onClick={() => editor.chain().focus().setHorizontalRule().run()}><Minus className="h-4 w-4" /></Btn>
        <Sep />
        <Btn title="Align left" active={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()}><AlignLeft className="h-4 w-4" /></Btn>
        <Btn title="Align center" active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()}><AlignCenter className="h-4 w-4" /></Btn>
        <Btn title="Align right" active={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()}><AlignRight className="h-4 w-4" /></Btn>
        <Sep />
        <Btn title="Link" active={editor.isActive('link')} onClick={setLink}><Link2 className="h-4 w-4" /></Btn>
        {editor.isActive('link') && <Btn title="Remove link" onClick={() => editor.chain().focus().unsetLink().run()}><Unlink className="h-4 w-4" /></Btn>}
        <Btn title="Insert image" onClick={() => setPickerOpen(true)}><ImagePlus className="h-4 w-4" /></Btn>
        <div className="ml-auto flex items-center gap-0.5">
          <Btn title="Undo" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}><Undo2 className="h-4 w-4" /></Btn>
          <Btn title="Redo" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}><Redo2 className="h-4 w-4" /></Btn>
          <Btn title="HTML source" active={source} onClick={() => setSource((s) => !s)}><FileCode className="h-4 w-4" /></Btn>
        </div>
      </div>
      {source ? (
        <textarea
          ref={sourceRef}
          value={value || ''}
          onChange={(e) => { onChange(e.target.value); editor.commands.setContent(e.target.value, false); }}
          className="block min-h-[320px] w-full resize-none overflow-hidden rounded-b-xl bg-ink-950 p-5 font-mono text-[13px] leading-relaxed text-emerald-300 outline-none"
          spellCheck={false}
        />
      ) : (
        <EditorContent editor={editor} />
      )}
      <MediaPicker open={pickerOpen} onClose={() => setPickerOpen(false)} onPick={(m) => editor.chain().focus().setImage({ src: m.url, alt: m.alt || '' }).run()} />
    </div>
  );
}
