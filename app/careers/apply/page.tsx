'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import PageLayout from '@/components/PageLayout';
import CareersHeader from '@/components/careers/CareersHeader';
import '@/styles/pages/careers.css'; // Global careers styles
import './apply.css'; // The new CSS file we will create

export default function ApplyPage() {
  const searchParams = useSearchParams();
  const prefilledTitle = searchParams.get('title') || '';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    jobTitle: prefilledTitle,
    experience: '',
    coverLetter: '',
  });

  const [resumeFile, setResumeFile] = useState<File | null>(null);

  useEffect(() => {
    if (prefilledTitle) {
      setFormData((prev) => ({ ...prev, jobTitle: prefilledTitle }));
    }
  }, [prefilledTitle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const data = new FormData();
      data.append('fullName', formData.fullName);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('jobTitle', formData.jobTitle);
      data.append('experience', formData.experience);
      data.append('coverLetter', formData.coverLetter);

      if (resumeFile) {
        data.append('resume', resumeFile);
      }

      const response = await fetch('/api/careers/apply', {
        method: 'POST',
        body: data,
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(true);
      } else {
        setError(result.error || 'Failed to submit application.');
      }
    } catch (err) {
      setError('A network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout route="careers">
      <div id="content" className="site-content-page clear" tabIndex={-1}>
        <div className="col-fluid">
          <div id="primary" className="content-area">
            <main id="main" className="site-main">
              <div className="elementor elementor-57">
                {/* Visual Header matching the main Careers page */}
                <CareersHeader />

                {/* Form Section */}
                <div className="apply-form-wrapper">
                  <div className="apply-form-container">
                    <h2 className="apply-form-title">
                      Apply for {formData.jobTitle || 'a Position'}
                    </h2>
                    <p className="apply-form-subtitle">
                      Submit your details and resume below. Our HR team will review your application.
                    </p>

                    {success ? (
                      <div className="apply-success-box">
                        <h3>Application Submitted Successfully!</h3>
                        <p>Thank you for applying. We will be in touch soon.</p>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="apply-form">
                        {error && <div className="apply-error-box">{error}</div>}

                        <div className="apply-form-row">
                          <div className="apply-form-group">
                            <label className="apply-form-label">Full Name *</label>
                            <input
                              required
                              type="text"
                              className="apply-form-input"
                              value={formData.fullName}
                              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            />
                          </div>
                          <div className="apply-form-group">
                            <label className="apply-form-label">Email Address *</label>
                            <input
                              required
                              type="email"
                              className="apply-form-input"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="apply-form-row">
                          <div className="apply-form-group">
                            <label className="apply-form-label">Phone Number *</label>
                            <input
                              required
                              type="tel"
                              className="apply-form-input"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                          </div>
                          <div className="apply-form-group">
                            <label className="apply-form-label">Position Applied For *</label>
                            <input
                              required
                              type="text"
                              className="apply-form-input"
                              readOnly={!!prefilledTitle}
                              value={formData.jobTitle}
                              onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="apply-form-group">
                          <label className="apply-form-label">Years of Experience</label>
                          <input
                            type="text"
                            placeholder="e.g. 3 Years in Civil Engineering"
                            className="apply-form-input"
                            value={formData.experience}
                            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                          />
                        </div>

                        <div className="apply-form-group">
                          <label className="apply-form-label">Resume / CV (PDF or DOC) *</label>
                          <input
                            required
                            type="file"
                            accept=".pdf,.doc,.docx"
                            className="apply-form-file"
                            onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                          />
                        </div>

                        <div className="apply-form-group">
                          <label className="apply-form-label">Cover Letter / Note</label>
                          <textarea
                            rows={4}
                            className="apply-form-textarea"
                            value={formData.coverLetter}
                            onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                          />
                        </div>

                        <button
                          disabled={isSubmitting}
                          type="submit"
                          className="apply-form-button"
                        >
                          {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}