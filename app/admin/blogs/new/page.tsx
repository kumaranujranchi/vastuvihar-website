'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewBlogPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Company',
    excerpt: '',
    content: ''
  });
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('category', formData.category);
    data.append('excerpt', formData.excerpt);
    data.append('content', formData.content);
    if (image) data.append('image', image);

    const res = await fetch('/api/admin/blogs', {
      method: 'POST',
      body: data,
    });

    if (res.ok) {
      alert('Blog posted successfully!');
      router.push('/admin'); // or wherever your blog list is
    } else {
      alert('Failed to post blog.');
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
      <h2>Create New Blog Post</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <input 
          required 
          type="text" 
          placeholder="Blog Title" 
          value={formData.title} 
          onChange={e => setFormData({...formData, title: e.target.value})}
          style={{ padding: '10px', fontSize: '16px', width: '100%' }} 
        />
        
        <select 
          value={formData.category} 
          onChange={e => setFormData({...formData, category: e.target.value})}
          style={{ padding: '10px', fontSize: '16px', width: '100%' }}
        >
          <option value="Company">Company</option>
          <option value="Social Media">Social Media</option>
          <option value="Tips & Tricks">Tips & Tricks</option>
          <option value="Uncategorized">Uncategorized</option>
        </select>

        <input 
          type="file" 
          accept="image/*" 
          onChange={e => setImage(e.target.files?.[0] || null)} 
        />

        <textarea 
          placeholder="Short Excerpt (shows on grid)" 
          rows={2} 
          value={formData.excerpt} 
          onChange={e => setFormData({...formData, excerpt: e.target.value})}
          style={{ padding: '10px', width: '100%' }} 
        />

        <textarea 
          required 
          placeholder="Full Blog Content (HTML allowed)" 
          rows={15} 
          value={formData.content} 
          onChange={e => setFormData({...formData, content: e.target.value})}
          style={{ padding: '10px', width: '100%', fontFamily: 'monospace' }} 
        />

        <button type="submit" disabled={isSubmitting} style={{ padding: '15px', background: '#c8102e', color: '#fff', cursor: 'pointer' }}>
          {isSubmitting ? 'Publishing...' : 'Publish Blog'}
        </button>
      </form>
    </div>
  );
}