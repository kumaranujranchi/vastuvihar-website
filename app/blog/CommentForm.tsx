'use client';

import { useState } from 'react';
import './CommentForm.css';

export default function CommentForm({ postId }: { postId: string }) {
  const [formData, setFormData] = useState({
    authorName: '',
    authorEmail: '',
    content: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          authorName: formData.authorName,
          authorEmail: formData.authorEmail,
          content: formData.content,
        }),
      });

      if (res.ok) {
        setMessage('Your comment has been submitted and is awaiting moderation.');
        setFormData({ authorName: '', authorEmail: '', content: '' });
      } else {
        const data = await res.json();
        setMessage(data.error || 'Failed to post comment.');
      }
    } catch (error) {
      setMessage('A network error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="blog-comment-form-container">
      <h3 className="comment-form-title">Leave a Reply</h3>
      <p className="comment-form-subtitle">Your email address will not be published. Required fields are marked *</p>
      
      {message && (
        <div className={`comment-msg-box ${message.includes('awaiting') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="blog-comment-form">
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
              required
              placeholder="Email Address *"
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

        <button type="submit" disabled={isSubmitting} className="comment-submit-btn">
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </button>
      </form>
    </div>
  );
}