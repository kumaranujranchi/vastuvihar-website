'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { compressImageToWebP } from '@/lib/clientImageCompress';
import styles from './new/new-blog.module.css';

const CATEGORIES = [
  'Company',
  'Social Media',
  'Tips & Tricks',
  'Real Estate Guide',
  'Architecture & Design',
  'Investment Insights',
  'Home Buying Tips',
  'Uncategorized',
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Creates a post, or edits the post with this ID when blogId is set. */
export default function BlogEditor({ blogId }: { blogId?: string }) {
  const router = useRouter();
  const isEditing = Boolean(blogId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditing);
  const [loadError, setLoadError] = useState('');
  const [originalSlug, setOriginalSlug] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugCustomized, setIsSlugCustomized] = useState(false);
  const [category, setCategory] = useState('Company');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('Vastu Vihar Editorial');
  const [isPublished, setIsPublished] = useState(true);

  // Featured Image & Alt
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageAlt, setImageAlt] = useState('');

  // SEO Fields
  const [metaTitle, setMetaTitle] = useState('');
  const [isMetaTitleCustomized, setIsMetaTitleCustomized] = useState(false);
  const [metaDesc, setMetaDesc] = useState('');
  const [isMetaDescCustomized, setIsMetaDescCustomized] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['Real Estate', 'Vastu Vihar']);

  // Load the post being edited. Its URL and SEO text stay as saved unless changed on purpose.
  useEffect(() => {
    if (!blogId) return;
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`/api/admin/blogs?id=${encodeURIComponent(blogId)}`);
        const json = await res.json();
        if (cancelled) return;
        if (!res.ok || !json.success) {
          setLoadError(json.error || 'Failed to load this blog post.');
          return;
        }
        const blog = json.blog;
        setTitle(blog.title);
        setSlug(blog.slug);
        setOriginalSlug(blog.slug);
        setIsSlugCustomized(true);
        setCategory(blog.category || 'Company');
        setExcerpt(blog.excerpt || '');
        setContent(blog.content || '');
        setAuthor(blog.author || '');
        setIsPublished(blog.isPublished);
        setImagePreview(blog.imagePath || null);
        setImageAlt(blog.imageAlt || '');
        setMetaTitle(blog.metaTitle || '');
        setIsMetaTitleCustomized(true);
        setMetaDesc(blog.metaDesc || '');
        setIsMetaDescCustomized(true);
        setTags((blog.keywords || '').split(',').map((tag: string) => tag.trim()).filter(Boolean));
      } catch {
        if (!cancelled) setLoadError('Network or server error while loading this blog post.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [blogId]);

  // Auto-generate slug when title changes
  useEffect(() => {
    if (!isSlugCustomized) {
      setSlug(slugify(title));
    }
  }, [title, isSlugCustomized]);

  // Auto-sync meta title if user hasn't typed custom one
  useEffect(() => {
    if (!isMetaTitleCustomized) {
      setMetaTitle(title);
    }
  }, [title, isMetaTitleCustomized]);

  // Auto-sync meta description with excerpt if not customized
  useEffect(() => {
    if (!isMetaDescCustomized && excerpt) {
      setMetaDesc(excerpt);
    }
  }, [excerpt, isMetaDescCustomized]);

  const handleImageChange = async (file: File | null) => {
    if (file) {
      const compressed = await compressImageToWebP(file);
      setImageFile(compressed);
      const url = URL.createObjectURL(compressed);
      setImagePreview(url);
      if (!imageAlt) {
        setImageAlt(title || compressed.name.split('.')[0]);
      }
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = tagInput.trim().replace(/^,+|,+$/g, '');
      if (trimmed && !tags.includes(trimmed)) {
        setTags([...tags, trimmed]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Real-time SEO Checklist & Score Calculation
  const seoChecklist = useMemo(() => {
    const wordCount = content.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
    const hasHeadings = /<h[2-4][^>]*>/i.test(content);
    const finalTitle = metaTitle || title;
    const finalDesc = metaDesc || excerpt;

    return [
      {
        id: 'title-length',
        label: 'SEO Title length (40 – 65 characters)',
        passed: finalTitle.length >= 40 && finalTitle.length <= 65,
        detail: `${finalTitle.length} chars`,
      },
      {
        id: 'meta-desc',
        label: 'Meta Description (120 – 160 characters)',
        passed: finalDesc.length >= 120 && finalDesc.length <= 165,
        detail: `${finalDesc.length} chars`,
      },
      {
        id: 'slug-clean',
        label: 'Clean, hyphenated URL slug',
        passed: slug.length > 2 && /^[a-z0-9-]+$/.test(slug),
        detail: slug ? `/${slug}` : 'Required',
      },
      {
        id: 'featured-image',
        label: 'Featured image with Alt text',
        passed: Boolean(imagePreview && imageAlt.trim()),
        detail: !imagePreview ? 'No image' : !imageAlt.trim() ? 'Missing Alt' : 'Ready',
      },
      {
        id: 'content-words',
        label: 'Article content length (300+ words)',
        passed: wordCount >= 300,
        detail: `${wordCount} words`,
      },
      {
        id: 'subheadings',
        label: 'Subheadings (H2, H3) in content',
        passed: hasHeadings,
        detail: hasHeadings ? 'Present' : 'Add H2/H3',
      },
    ];
  }, [title, metaTitle, excerpt, metaDesc, slug, imagePreview, imageAlt, content]);

  const seoScore = useMemo(() => {
    const passedCount = seoChecklist.filter((c) => c.passed).length;
    return Math.round((passedCount / seoChecklist.length) * 100);
  }, [seoChecklist]);

  // Form Submission
  const handleSubmit = async (e?: React.FormEvent, forceDraft = false) => {
    if (e) e.preventDefault();

    if (!title.trim()) {
      alert('Please enter a blog post title');
      return;
    }

    if (!content.trim() || content === '<p></p>') {
      alert('Please write blog content before publishing');
      return;
    }

    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append('title', title.trim());
      data.append('slug', slug.trim() || slugify(title));
      data.append('category', category);
      data.append('excerpt', excerpt.trim());
      data.append('content', content);
      data.append('author', author.trim());
      data.append('metaTitle', (metaTitle || title).trim());
      data.append('metaDesc', (metaDesc || excerpt || title).trim());
      data.append('keywords', tags.join(', '));
      data.append('imageAlt', (imageAlt || title).trim());
      data.append('isPublished', forceDraft ? 'false' : String(isPublished));

      if (imageFile) {
        data.append('image', imageFile);
      } else if (isEditing && !imagePreview) {
        data.append('removeImage', 'true');
      }
      if (blogId) data.append('id', blogId);

      const res = await fetch('/api/admin/blogs/', {
        method: isEditing ? 'PATCH' : 'POST',
        body: data,
      });

      const json = await res.json();
      if (res.ok && json.success) {
        alert(
          forceDraft
            ? 'Draft saved successfully!'
            : isEditing
              ? 'Blog changes saved successfully!'
              : 'Blog article published successfully!',
        );
        router.push('/admin');
        router.refresh();
      } else {
        alert(json.error || 'Failed to save blog post');
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error('Submission error:', err);
      alert('Network or server error while publishing');
      setIsSubmitting(false);
    }
  };

  const currentMetaTitle = metaTitle || title || 'Your Blog Post Title';
  const currentMetaDesc =
    metaDesc ||
    excerpt ||
    'Preview snippet of what this blog post is about. Search engines display this text in search results.';

  if (isLoading || loadError) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.innerContainer}>
          <Link href="/admin" className={styles.backBtn}>
            <span>Back to Dashboard</span>
          </Link>
          <p role={loadError ? 'alert' : 'status'} style={{ marginTop: '24px' }}>
            {loadError || 'Loading blog post…'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.innerContainer}>
        {/* Top Header Bar */}
        <div className={styles.topNav}>
          <div className={styles.navLeft}>
            <Link href="/admin" className={styles.backBtn}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <span>Back to Dashboard</span>
            </Link>

            <div className={styles.pageHeader}>
              <h1 className={styles.pageTitle}>{isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}</h1>
              <p className={styles.pageSubtitle}>
                {isEditing
                  ? 'Update this article. Its original publish date stays the same.'
                  : 'Draft and optimize articles for the Vastu Vihar blog.'}
              </p>
            </div>
          </div>

          <div className={styles.actionBtns}>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSubmit(undefined, true)}
              className={styles.draftBtn}
            >
              Save as Draft
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSubmit(undefined, false)}
              className={styles.publishBtn}
            >
              {isSubmitting ? (
                <span>{isEditing ? 'Saving...' : 'Publishing...'}</span>
              ) : (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>{isEditing ? 'Save Changes' : 'Publish Blog'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Main 2-Column Grid */}
        <div className={styles.layoutGrid}>
          {/* LEFT: Content Writing Area */}
          <div className={styles.mainColumn}>
            {/* Card 1: Article Essentials */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Article Details</h2>

              {/* Title */}
              <div className={styles.formGroup}>
                <div className={styles.labelRow}>
                  <label htmlFor="blog-title" className={styles.label}>
                    Blog Title
                  </label>
                  <span
                    className={`${styles.charCount} ${
                      title.length >= 40 && title.length <= 65 ? styles.optimalCount : ''
                    }`}
                  >
                    {title.length} characters {title.length >= 40 && title.length <= 65 ? '(Optimal)' : ''}
                  </span>
                </div>
                <input
                  id="blog-title"
                  type="text"
                  required
                  placeholder="e.g. Modern Duplex Living: Why Vastu Vihar Homes Lead Eastern India"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={styles.titleInput}
                />
              </div>

              {/* Permalink */}
              <div className={styles.formGroup}>
                <div className={styles.labelRow}>
                  <label htmlFor="blog-slug" className={styles.label}>
                    URL Permalink Slug
                  </label>
                  {isSlugCustomized && (
                    <button
                      type="button"
                      className={styles.slugResetBtn}
                      onClick={() => {
                        setIsSlugCustomized(false);
                        setSlug(slugify(title));
                      }}
                    >
                      Reset to Auto-generate
                    </button>
                  )}
                </div>
                <div className={styles.slugWrapper}>
                  <span className={styles.slugPrefix}>vastuvihar.com/blog/</span>
                  <input
                    id="blog-slug"
                    type="text"
                    value={slug}
                    onChange={(e) => {
                      setIsSlugCustomized(true);
                      setSlug(slugify(e.target.value));
                    }}
                    placeholder="my-post-url-slug"
                    className={styles.slugInput}
                  />
                  <span style={{ paddingRight: '12px', color: '#9ca3af' }}>/</span>
                </div>
                {isEditing && slug !== originalSlug && (
                  <span className={styles.fieldNote} role="status">
                    Changing the URL breaks existing links to this post.
                  </span>
                )}
              </div>

              {/* Category & Excerpt */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
                <div className={styles.formGroup}>
                  <label htmlFor="blog-category" className={styles.label}>
                    Category
                  </label>
                  <select
                    id="blog-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={styles.selectInput}
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <div className={styles.labelRow}>
                    <label htmlFor="blog-excerpt" className={styles.label}>
                      Short Summary / Excerpt
                    </label>
                    <span className={styles.charCount}>{excerpt.length} / 200</span>
                  </div>
                  <textarea
                    id="blog-excerpt"
                    rows={2}
                    placeholder="A 1-2 sentence hook shown on blog archive cards and search snippets..."
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    className={styles.textarea}
                  />
                </div>
              </div>
            </div>

            {/* Card 2: Rich Text Editor */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Content &amp; Formatting</h2>

              <RichTextEditor
                value={content}
                onChange={setContent}
                placeholder="Write your article here... Use the toolbar above to style headings, lists, quotes, images, and links."
                minHeight="420px"
              />
            </div>
          </div>

          {/* RIGHT: Settings & SEO */}
          <div className={styles.sideColumn}>
            {/* Card 1: Publish Settings */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Publish Settings</h3>

              <div className={styles.formGroup}>
                <label className={styles.label}>Publication Status</label>
                <select
                  value={isPublished ? 'published' : 'draft'}
                  onChange={(e) => setIsPublished(e.target.value === 'published')}
                  className={styles.selectInput}
                >
                  <option value="published">🟢 Published (Live immediately)</option>
                  <option value="draft">🟡 Draft (Hidden from public)</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="blog-author" className={styles.label}>
                  Author Name
                </label>
                <input
                  id="blog-author"
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. Vastu Vihar Editorial"
                  className={styles.textInput}
                />
              </div>
            </div>

            {/* Card 2: Featured Image (Solid card with NO dashed border or bracket) */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Featured Image</h3>

              {imagePreview ? (
                <div className={styles.imagePreviewWrap}>
                  <img src={imagePreview} alt="Featured Preview" className={styles.previewImage} />
                  <div className={styles.imageActions}>
                    <label className={styles.changeImageBtn}>
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
                      />
                      Change Image
                    </label>
                    <button
                      type="button"
                      onClick={() => handleImageChange(null)}
                      className={styles.removeImageBtn}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div className={styles.uploadCard}>
                  <div className={styles.uploadIconWrap}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                  <div className={styles.uploadInfo}>
                    <span className={styles.uploadTitle}>Featured post image</span>
                    <span className={styles.uploadHint}>JPG, PNG, WebP up to 5MB</span>
                  </div>
                  <label className={styles.uploadButton}>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
                    />
                    Browse File
                  </label>
                </div>
              )}

              {/* Alt Text */}
              <div className={styles.formGroup} style={{ marginTop: '14px' }}>
                <div className={styles.labelRow}>
                  <label htmlFor="image-alt" className={styles.label}>
                    Image Alt Text
                  </label>
                </div>
                <input
                  id="image-alt"
                  type="text"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="Describe image for search engines..."
                  className={styles.textInput}
                />
                <span className={styles.fieldNote}>
                  Text for Google Image Search and accessibility.
                </span>
              </div>
            </div>

            {/* Card 3: SEO Optimization */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>SEO &amp; Search Optimization</h3>

              {/* Real-time SEO Score Meter */}
              <div className={styles.seoScoreCard}>
                <div className={styles.scoreRow}>
                  <span className={styles.scoreLabel}>SEO Health Score</span>
                  <span
                    className={`${styles.scorePill} ${
                      seoScore >= 80
                        ? styles.scoreGood
                        : seoScore >= 50
                        ? styles.scoreMedium
                        : styles.scorePoor
                    }`}
                  >
                    {seoScore}/100 {seoScore >= 80 ? '• Great' : seoScore >= 50 ? '• Moderate' : '• Needs Work'}
                  </span>
                </div>

                <div className={styles.scoreBarBg}>
                  <div
                    className={styles.scoreBarFill}
                    style={{
                      width: `${seoScore}%`,
                      backgroundColor:
                        seoScore >= 80 ? '#16a34a' : seoScore >= 50 ? '#d97706' : '#dc2626',
                    }}
                  />
                </div>

                <div className={styles.checklist}>
                  {seoChecklist.map((item) => (
                    <div key={item.id} className={styles.checklistItem}>
                      {item.passed ? (
                        <svg
                          className={styles.checkIconSuccess}
                          width="14"
                          height="14"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          className={styles.checkIconWarning}
                          width="14"
                          height="14"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                      <span>
                        {item.label} <strong style={{ color: '#111827' }}>({item.detail})</strong>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Meta Title */}
              <div className={styles.formGroup}>
                <div className={styles.labelRow}>
                  <label htmlFor="meta-title" className={styles.label}>
                    SEO Meta Title
                  </label>
                  <span
                    className={`${styles.charCount} ${
                      currentMetaTitle.length >= 50 && currentMetaTitle.length <= 60
                        ? styles.optimalCount
                        : styles.warningCount
                    }`}
                  >
                    {currentMetaTitle.length}/60 chars
                  </span>
                </div>
                <input
                  id="meta-title"
                  type="text"
                  value={metaTitle}
                  onChange={(e) => {
                    setIsMetaTitleCustomized(true);
                    setMetaTitle(e.target.value);
                  }}
                  placeholder="Defaults to post title..."
                  className={styles.textInput}
                />
              </div>

              {/* Meta Description */}
              <div className={styles.formGroup}>
                <div className={styles.labelRow}>
                  <label htmlFor="meta-desc" className={styles.label}>
                    SEO Meta Description
                  </label>
                  <span
                    className={`${styles.charCount} ${
                      currentMetaDesc.length >= 120 && currentMetaDesc.length <= 160
                        ? styles.optimalCount
                        : styles.warningCount
                    }`}
                  >
                    {currentMetaDesc.length}/160 chars
                  </span>
                </div>
                <textarea
                  id="meta-desc"
                  rows={3}
                  value={metaDesc}
                  onChange={(e) => {
                    setIsMetaDescCustomized(true);
                    setMetaDesc(e.target.value);
                  }}
                  placeholder="Defaults to excerpt..."
                  className={styles.textarea}
                />
              </div>

              {/* Focus Keywords / Tags */}
              <div className={styles.formGroup}>
                <label htmlFor="tag-input" className={styles.label}>
                  Focus Keywords / Tags
                </label>
                <input
                  id="tag-input"
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Type keyword and press Enter or comma..."
                  className={styles.textInput}
                />
                <div className={styles.tagsWrap}>
                  {tags.map((tag) => (
                    <span key={tag} className={styles.tagPill}>
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className={styles.tagRemoveBtn}
                        aria-label={`Remove tag ${tag}`}
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Live Google Search Preview */}
              <div style={{ marginTop: '16px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#4b5563', textTransform: 'uppercase' }}>
                  Google Search Snippet Preview
                </span>

                <div className={styles.serpContainer}>
                  <div className={styles.serpHeader}>
                    <div className={styles.serpFavicon}>V</div>
                    <div className={styles.serpSiteUrl}>
                      <span className={styles.serpSiteName}>Vastu Vihar</span>
                      <span className={styles.serpUrl}>
                        https://vastuvihar.org › blog › {slug || 'post-slug'}
                      </span>
                    </div>
                  </div>

                  <h4 className={styles.serpTitle}>
                    {currentMetaTitle} | Vastu Vihar
                  </h4>

                  <p className={styles.serpSnippet}>
                    {currentMetaDesc.slice(0, 160)}
                    {currentMetaDesc.length > 160 ? '...' : ''}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
