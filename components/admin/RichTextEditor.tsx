'use client';

import React, { useRef, useState, useEffect } from 'react';
import styles from './RichTextEditor.module.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write your blog post here...',
  minHeight = '380px',
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeMode, setActiveMode] = useState<'visual' | 'code' | 'preview'>('visual');
  const [rawHtml, setRawHtml] = useState(value);
  const [isUploading, setIsUploading] = useState(false);
  const [stats, setStats] = useState({ words: 0, chars: 0, readTime: '1 min read' });
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikeThrough: false,
    ul: false,
    ol: false,
  });

  // Calculate word and character stats
  useEffect(() => {
    const text = (value || '').replace(/<[^>]*>/g, ' ').trim();
    const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
    const chars = text.length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    setStats({
      words,
      chars,
      readTime: `${minutes} min read`,
    });
  }, [value]);

  // Sync editor content when value changes externally
  useEffect(() => {
    if (editorRef.current && activeMode === 'visual') {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
    setRawHtml(value || '');
  }, [value, activeMode]);

  const checkActiveFormats = () => {
    try {
      setActiveFormats({
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline'),
        strikeThrough: document.queryCommandState('strikeThrough'),
        ul: document.queryCommandState('insertUnorderedList'),
        ol: document.queryCommandState('insertOrderedList'),
      });
    } catch {
      // Ignore if document not focused
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange(html);
      setRawHtml(html);
      checkActiveFormats();
    }
  };

  const executeCommand = (command: string, arg: string | undefined = undefined) => {
    if (activeMode !== 'visual') return;
    editorRef.current?.focus();
    document.execCommand(command, false, arg);
    handleInput();
  };

  const handleFormatBlock = (tag: string) => {
    if (activeMode !== 'visual') return;
    editorRef.current?.focus();
    document.execCommand('formatBlock', false, tag);
    handleInput();
  };

  const handleInsertLink = () => {
    const selection = window.getSelection();
    const selectedText = selection?.toString() || '';
    const url = prompt('Enter link URL (e.g., https://vastuvihar.org):', 'https://');
    if (!url || url === 'https://') return;

    if (selectedText) {
      executeCommand('createLink', url);
    } else {
      const linkText = prompt('Enter link text:', url) || url;
      const linkHtml = `<a href="${url}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
      executeCommand('insertHTML', linkHtml);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/blogs/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        const altText = prompt('Enter Alt text for this image (recommended for SEO):', file.name.split('.')[0]) || '';
        const imgHtml = `
          <figure style="margin: 24px 0; text-align: center;">
            <img src="${data.url}" alt="${altText}" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);" />
            ${altText ? `<figcaption style="margin-top: 8px; font-size: 13px; color: #64748b; font-style: italic;">${altText}</figcaption>` : ''}
          </figure>
          <p></p>
        `;
        executeCommand('insertHTML', imgHtml);
      } else {
        alert(data.error || 'Failed to upload image');
      }
    } catch (err) {
      console.error('Upload failed', err);
      alert('Error uploading image');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleInsertImageUrl = () => {
    const url = prompt('Enter Image URL:');
    if (!url) return;
    const altText = prompt('Enter Image Alt Text (for SEO):', 'Blog image') || '';
    const imgHtml = `
      <figure style="margin: 24px 0; text-align: center;">
        <img src="${url}" alt="${altText}" style="max-width: 100%; height: auto; border-radius: 8px;" />
        ${altText ? `<figcaption style="margin-top: 8px; font-size: 13px; color: #64748b;">${altText}</figcaption>` : ''}
      </figure>
      <p></p>
    `;
    executeCommand('insertHTML', imgHtml);
  };

  const handleInsertQuote = () => {
    const quoteHtml = `
      <blockquote style="border-left: 4px solid #08AAEC; margin: 20px 0; padding: 12px 20px; font-style: italic; background: #f8fafc; border-radius: 0 8px 8px 0; color: #334155;">
        "Add your quote or key takeaway here..."
      </blockquote>
      <p></p>
    `;
    executeCommand('insertHTML', quoteHtml);
  };

  const handleInsertCallout = () => {
    const calloutHtml = `
      <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px 20px; margin: 24px 0; color: #1e3a8a;">
        <strong style="color: #1d4ed8; display: block; margin-bottom: 4px;">Key Highlight:</strong>
        Write your important point or summary takeaway here.
      </div>
      <p></p>
    `;
    executeCommand('insertHTML', calloutHtml);
  };

  return (
    <div className={styles.editorContainer}>
      {/* Top Header Bar with Modes & Stats */}
      <div className={styles.topBar}>
        <div className={styles.modeTabs}>
          <button
            type="button"
            className={`${styles.modeTab} ${activeMode === 'visual' ? styles.activeModeTab : ''}`}
            onClick={() => setActiveMode('visual')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            <span>Visual</span>
          </button>

          <button
            type="button"
            className={`${styles.modeTab} ${activeMode === 'code' ? styles.activeModeTab : ''}`}
            onClick={() => setActiveMode('code')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
            <span>HTML</span>
          </button>

          <button
            type="button"
            className={`${styles.modeTab} ${activeMode === 'preview' ? styles.activeModeTab : ''}`}
            onClick={() => setActiveMode('preview')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span>Preview</span>
          </button>
        </div>

        <div className={styles.statsBadge}>
          <span>{stats.words} words</span>
          <span>•</span>
          <span>{stats.chars} chars</span>
          <span>•</span>
          <span className={styles.readTimePill}>{stats.readTime}</span>
        </div>
      </div>

      {/* Uniform Toolbar: every button is exactly 34x34px */}
      {activeMode === 'visual' && (
        <div className={styles.toolbar}>
          {/* Format Selector */}
          <div className={styles.toolbarGroup}>
            <select
              className={styles.formatSelect}
              onChange={(e) => {
                handleFormatBlock(e.target.value);
                e.target.value = 'p';
              }}
              defaultValue="p"
              title="Heading Style"
            >
              <option value="p">Paragraph</option>
              <option value="h2">Heading 2 (H2)</option>
              <option value="h3">Heading 3 (H3)</option>
              <option value="h4">Heading 4 (H4)</option>
              <option value="pre">Code</option>
            </select>
          </div>

          <div className={styles.divider} />

          {/* Text Style: B, I, U, S */}
          <div className={styles.toolbarGroup}>
            <button
              type="button"
              className={`${styles.toolBtn} ${activeFormats.bold ? styles.activeBtn : ''}`}
              onClick={() => executeCommand('bold')}
              title="Bold (Ctrl+B)"
              aria-label="Bold"
            >
              <strong>B</strong>
            </button>
            <button
              type="button"
              className={`${styles.toolBtn} ${activeFormats.italic ? styles.activeBtn : ''}`}
              onClick={() => executeCommand('italic')}
              title="Italic (Ctrl+I)"
              aria-label="Italic"
            >
              <em>I</em>
            </button>
            <button
              type="button"
              className={`${styles.toolBtn} ${activeFormats.underline ? styles.activeBtn : ''}`}
              onClick={() => executeCommand('underline')}
              title="Underline (Ctrl+U)"
              aria-label="Underline"
            >
              <u>U</u>
            </button>
            <button
              type="button"
              className={`${styles.toolBtn} ${activeFormats.strikeThrough ? styles.activeBtn : ''}`}
              onClick={() => executeCommand('strikeThrough')}
              title="Strikethrough"
              aria-label="Strikethrough"
            >
              <s>S</s>
            </button>
          </div>

          <div className={styles.divider} />

          {/* Alignment */}
          <div className={styles.toolbarGroup}>
            <button
              type="button"
              className={styles.toolBtn}
              onClick={() => executeCommand('justifyLeft')}
              title="Align Left"
              aria-label="Align Left"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="21" y1="6" x2="3" y2="6" />
                <line x1="15" y1="12" x2="3" y2="12" />
                <line x1="17" y1="18" x2="3" y2="18" />
              </svg>
            </button>
            <button
              type="button"
              className={styles.toolBtn}
              onClick={() => executeCommand('justifyCenter')}
              title="Align Center"
              aria-label="Align Center"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="6" />
                <line x1="21" y1="12" x2="3" y2="12" />
                <line x1="18" y1="18" x2="6" y2="18" />
              </svg>
            </button>
            <button
              type="button"
              className={styles.toolBtn}
              onClick={() => executeCommand('justifyRight')}
              title="Align Right"
              aria-label="Align Right"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="21" y1="6" x2="3" y2="6" />
                <line x1="21" y1="12" x2="9" y2="12" />
                <line x1="21" y1="18" x2="7" y2="18" />
              </svg>
            </button>
          </div>

          <div className={styles.divider} />

          {/* Lists */}
          <div className={styles.toolbarGroup}>
            <button
              type="button"
              className={`${styles.toolBtn} ${activeFormats.ul ? styles.activeBtn : ''}`}
              onClick={() => executeCommand('insertUnorderedList')}
              title="Bullet List"
              aria-label="Bullet List"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="9" y1="6" x2="20" y2="6" />
                <line x1="9" y1="12" x2="20" y2="12" />
                <line x1="9" y1="18" x2="20" y2="18" />
                <circle cx="4" cy="6" r="1.5" fill="currentColor" />
                <circle cx="4" cy="12" r="1.5" fill="currentColor" />
                <circle cx="4" cy="18" r="1.5" fill="currentColor" />
              </svg>
            </button>
            <button
              type="button"
              className={`${styles.toolBtn} ${activeFormats.ol ? styles.activeBtn : ''}`}
              onClick={() => executeCommand('insertOrderedList')}
              title="Numbered List"
              aria-label="Numbered List"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="10" y1="6" x2="21" y2="6" />
                <line x1="10" y1="12" x2="21" y2="12" />
                <line x1="10" y1="18" x2="21" y2="18" />
                <path d="M4 6h2v4H4" />
                <path d="M4 14h2.5L4 18h3" />
              </svg>
            </button>
          </div>

          <div className={styles.divider} />

          {/* Inserts: Link, Image Upload, Image URL, Quote, Callout, HR */}
          <div className={styles.toolbarGroup}>
            <button
              type="button"
              className={styles.toolBtn}
              onClick={handleInsertLink}
              title="Insert Link"
              aria-label="Insert Link"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </button>

            {/* Upload Inline Image */}
            <button
              type="button"
              className={`${styles.toolBtn} ${isUploading ? styles.uploading : ''}`}
              onClick={() => fileInputRef.current?.click()}
              title="Upload Image"
              aria-label="Upload Image"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageUpload}
            />

            <button
              type="button"
              className={styles.toolBtn}
              onClick={handleInsertImageUrl}
              title="Insert Image by Web URL"
              aria-label="Image URL"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </button>

            <button
              type="button"
              className={styles.toolBtn}
              onClick={handleInsertQuote}
              title="Insert Blockquote"
              aria-label="Blockquote"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
              </svg>
            </button>

            <button
              type="button"
              className={styles.toolBtn}
              onClick={handleInsertCallout}
              title="Insert Highlight Callout Box"
              aria-label="Callout Box"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </button>

            <button
              type="button"
              className={styles.toolBtn}
              onClick={() => executeCommand('insertHorizontalRule')}
              title="Horizontal Divider"
              aria-label="Horizontal Rule"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12" strokeWidth="3" />
              </svg>
            </button>
          </div>

          <div className={styles.divider} />

          {/* Undo / Redo / Clear */}
          <div className={styles.toolbarGroup} style={{ marginLeft: 'auto' }}>
            <button
              type="button"
              className={styles.toolBtn}
              onClick={() => executeCommand('undo')}
              title="Undo (Ctrl+Z)"
              aria-label="Undo"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 7v6h6" />
                <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
              </svg>
            </button>
            <button
              type="button"
              className={styles.toolBtn}
              onClick={() => executeCommand('redo')}
              title="Redo (Ctrl+Y)"
              aria-label="Redo"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 7v6h-6" />
                <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" />
              </svg>
            </button>
            <button
              type="button"
              className={styles.toolBtn}
              onClick={() => executeCommand('removeFormat')}
              title="Clear Formatting"
              aria-label="Clear Formatting"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Editor Body */}
      <div className={styles.contentContainer} style={{ minHeight }}>
        {activeMode === 'visual' && (
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            className={styles.visualEditor}
            onInput={handleInput}
            onKeyUp={checkActiveFormats}
            onMouseUp={checkActiveFormats}
            data-placeholder={placeholder}
          />
        )}

        {activeMode === 'code' && (
          <textarea
            value={rawHtml}
            onChange={(e) => {
              setRawHtml(e.target.value);
              onChange(e.target.value);
            }}
            placeholder="Type or paste raw HTML code here..."
            className={styles.codeEditor}
          />
        )}

        {activeMode === 'preview' && (
          <div className={styles.previewContainer}>
            <div className={styles.previewBadge}>Article Preview</div>
            <div
              className={`dynamic-blog-content ${styles.previewContent}`}
              dangerouslySetInnerHTML={{ __html: value || '<p style="color:#94a3b8; font-style:italic;">No blog content written yet. Switch to Visual Editor to start writing.</p>' }}
            />
          </div>
        )}
      </div>

      {isUploading && (
        <div className={styles.uploadOverlay}>
          <div className={styles.spinner} />
          <span>Uploading and optimizing image...</span>
        </div>
      )}
    </div>
  );
}
