'use client';

import { useState } from 'react';
import ConsentFields from '@/components/privacy/ConsentFields';
import './CommentForm.css';

export default function CommentForm({ postId }: { postId: string }) {
  const [formData, setFormData] = useState({
    authorName: '',
    authorEmail: '',
    content: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [succeeded, setSucceeded] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const submitted = new FormData(form);
    setIsSubmitting(true);
    setMessage('');
    setSucceeded(false);

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          authorName: formData.authorName,
          authorEmail: formData.authorEmail,
          content: formData.content,
          consentPrimary: submitted.get('consentPrimary') === 'true',
          noticeLanguage: submitted.get('noticeLanguage') || 'en',
          website_url: submitted.get('website_url') || '',
        }),
      });

      if (res.ok) {
        setSucceeded(true);
        setMessage('Your comment has been submitted and is awaiting moderation.');
        setFormData({ authorName: '', authorEmail: '', content: '' });
        form.reset();
      } else {
        const data = await res.json();
        setMessage(data.error || 'Failed to post comment.');
      }
    } catch {
      setMessage('A network error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="blog-comment-form-container">
      <h3 className="comment-form-title">Leave a Reply</h3>
      <p className="comment-form-subtitle">Your email address is optional and is never published. Required fields are marked *</p>

      {message && (
        <div className={`comment-msg-box ${succeeded ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="blog-comment-form">
        <div style={{ display: 'none' }} aria-hidden="true">
          <input type="text" name="website_url" tabIndex={-1} autoComplete="off" />
        </div>
        <div className="comment-form-row">
          <div className="comment-form-group">
            <input
              type="text"
              required
              placeholder="Full Name *"
              value={formData.authorName}
              onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
              className="comment-input"
            />
          </div>
          <div className="comment-form-group">
            <input
              type="email"
              placeholder="Email Address (optional)"
              value={formData.authorEmail}
              onChange={(e) => setFormData({ ...formData, authorEmail: e.target.value })}
              className="comment-input"
            />
          </div>
        </div>

        <div className="comment-form-group">
          <textarea
            required
            rows={5}
            placeholder="Write your comment here... *"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="comment-textarea"
          ></textarea>
        </div>

        <ConsentFields form="comment" />

        <button type="submit" disabled={isSubmitting} className="comment-submit-btn">
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </button>
      </form>
    </div>
  );
}
