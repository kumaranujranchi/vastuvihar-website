'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './admin.module.css';

interface Lead {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  city: string | null;
  budget: string | null;
  project: string | null;
  address: string | null;
  message: string | null;
  source: string;
  status: string;
  marketingConsent?: boolean;
  marketingWithdrawnAt?: string | null;
  adChannel?: string | null;
  adUtmSource?: string | null;
  adUtmMedium?: string | null;
  adUtmCampaign?: string | null;
  legalHoldReason?: string | null;
  createdAt: string;
}

const AD_CHANNEL_LABELS: Record<string, string> = { google_ads: 'Google Ads', meta: 'Meta', campaign: 'Campaign link' };

const adSourceLabel = (lead: Lead) =>
  [AD_CHANNEL_LABELS[lead.adChannel || ''] || lead.adChannel, lead.adUtmSource, lead.adUtmMedium, lead.adUtmCampaign].filter(Boolean).join(' / ');

interface JobVacancy {
  id: string;
  title: string;
  department: string | null;
  location: string;
  type: string;
  description: string;
  requirements: string | null;
  isActive: boolean;
  createdAt: string;
}

interface JobApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  jobTitle: string;
  experience: string | null;
  coverLetter: string | null;
  resumePath: string | null;
  status: string;
  createdAt: string;
}

const CITIES_LIST = [
  'All Cities',
  'Patna',
  'Ranchi',
  'Ara',
  'Buxar',
  'Varanasi',
  'Bhubaneswar',
  'Jamshedpur',
  'Gaya',
  'Dhanbad',
  'Bokaro',
  'Muzaffarpur',
  'Bhagalpur',
  'Siliguri',
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'leads' | 'vacancies' | 'applications' | 'blogs'>('leads');
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState<string[]>([]);
  const can = (permission: string) => permissions.includes(permission);

  // Leads State
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadStats, setLeadStats] = useState({ totalCount: 0, newCount: 0, contactedCount: 0, convertedCount: 0 });
  const [leadSearch, setLeadSearch] = useState('');
  const [leadFilterStatus, setLeadFilterStatus] = useState('ALL');
  const [leadFilterCity, setLeadFilterCity] = useState('All Cities');
  const [dateRange, setDateRange] = useState('ALL');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [blogs, setBlogs] = useState<any[]>([]);
  // Vacancies State
  const [vacancies, setVacancies] = useState<JobVacancy[]>([]);
  const [showJobModal, setShowJobModal] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [jobForm, setJobForm] = useState({
    title: '',
    department: '',
    location: 'Ranchi, JH',
    type: 'Full - Time',
    description: '',
    requirements: '',
    isActive: true,
  });

  // Applications State
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [appStats, setAppStats] = useState({ totalCount: 0, shortlistedCount: 0, pendingCount: 0 });
  const [appSearch, setAppSearch] = useState('');
  const [appFilterStatus, setAppFilterStatus] = useState('ALL');

  // Verify auth on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/admin/auth');
        const data = await res.json();
        if (!data.authenticated) {
          router.push('/admin/login');
        } else {
          const granted: string[] = data.user?.permissions || [];
          setPermissions(granted);
          // Open the first tab this role may use.
          if (granted.includes('leads:read')) setActiveTab('leads');
          else if (granted.includes('applications:read')) setActiveTab('applications');
          else if (granted.includes('blogs:manage')) setActiveTab('blogs');
          else if (granted.includes('privacy:read') || granted.includes('comments:moderate')) {
            router.replace('/admin/privacy/');
            return;
          }
          setLoading(false);
        }
      } catch {
        router.push('/admin/login');
      }
    }
    checkAuth();
  }, [router]);

  // Fetch Leads
  const fetchLeads = useCallback(async () => {
    try {
      const query = new URLSearchParams();
      if (leadSearch) query.set('search', leadSearch);
      if (leadFilterStatus && leadFilterStatus !== 'ALL') query.set('status', leadFilterStatus);
      const res = await fetch(`/api/admin/leads?${query.toString()}`);
      const data = await res.json();
      if (data.success) {
        let filtered = data.leads as Lead[];
        if (leadFilterCity && leadFilterCity !== 'All Cities') {
          filtered = filtered.filter(
            (l) => l.city?.toLowerCase() === leadFilterCity.toLowerCase()
          );
        }
        setLeads(filtered);
        if (data.stats) setLeadStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to load leads:', err);
    }
  }, [leadSearch, leadFilterStatus, leadFilterCity]);

  // Fetch Vacancies
  const fetchVacancies = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/vacancies');
      const data = await res.json();
      if (data.success) {
        setVacancies(data.vacancies);
      }
    } catch (err) {
      console.error('Failed to load vacancies:', err);
    }
  }, []);

  // Fetch Applications
  const fetchApplications = useCallback(async () => {
    try {
      const query = new URLSearchParams();
      if (appSearch) query.set('search', appSearch);
      if (appFilterStatus && appFilterStatus !== 'ALL') query.set('status', appFilterStatus);
      const res = await fetch(`/api/admin/applications?${query.toString()}`);
      const data = await res.json();
      if (data.success) {
        setApplications(data.applications);
        if (data.stats) setAppStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to load applications:', err);
    }
  }, [appSearch, appFilterStatus]);


  const fetchBlogs = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/blogs');
      const data = await res.json();
      if (data.success) setBlogs(data.blogs);
    } catch (err) {
      console.error('Failed to load blogs:', err);
    }
  }, []);

  // Update your main useEffect to trigger it:
  useEffect(() => {
    if (!loading) {
      if (activeTab === 'leads') fetchLeads();
      if (activeTab === 'vacancies') fetchVacancies();
      if (activeTab === 'applications') fetchApplications();
      if (activeTab === 'blogs') fetchBlogs(); // <-- Add this
    }
  }, [activeTab, loading, fetchLeads, fetchVacancies, fetchApplications, fetchBlogs]);

  // Delete handler
  const handleDeleteBlog = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    try {
      const res = await fetch(`/api/admin/blogs?id=${id}`, { method: 'DELETE' });
      if (res.ok) setBlogs((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error(err);
    }
  };


  // Handle Logout
  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
    router.refresh();
  };

  // Clear filters
  const handleClearFilters = () => {
    setLeadSearch('');
    setLeadFilterStatus('ALL');
    setLeadFilterCity('All Cities');
    setDateRange('ALL');
  };

  // Update Lead Status
  const handleLeadStatusChange = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
        fetchLeads();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Lead
  const handleDeleteLead = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    try {
      const res = await fetch(`/api/admin/leads?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setLeads((prev) => prev.filter((l) => l.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // The server builds the file, so each export is permission-checked and audited.
  const exportLeadsCSV = () => {
    window.location.href = '/api/admin/leads/export';
  };

  // Open Create Job Modal
  const handleOpenCreateJob = () => {
    setEditingJobId(null);
    setJobForm({
      title: '',
      department: '',
      location: 'Ranchi, JH',
      type: 'Full - Time',
      description: '',
      requirements: '',
      isActive: true,
    });
    setShowJobModal(true);
  };

  // Open Edit Job Modal
  const handleEditVacancy = (job: JobVacancy) => {
    setEditingJobId(job.id);
    setJobForm({
      title: job.title || '',
      department: job.department || '',
      location: job.location || 'Ranchi, JH',
      type: job.type || 'Full - Time',
      description: job.description || '',
      requirements: job.requirements || '',
      isActive: job.isActive !== false,
    });
    setShowJobModal(true);
  };

  // Create or Update Job Vacancy
  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isEdit = Boolean(editingJobId);
      const url = '/api/admin/vacancies';
      const method = isEdit ? 'PATCH' : 'POST';
      const payload = isEdit ? { id: editingJobId, ...jobForm } : jobForm;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setShowJobModal(false);
        setEditingJobId(null);
        setJobForm({
          title: '',
          department: '',
          location: 'Ranchi, JH',
          type: 'Full - Time',
          description: '',
          requirements: '',
          isActive: true,
        });
        fetchVacancies();
      } else {
        alert(data.error || `Failed to ${isEdit ? 'update' : 'post'} vacancy`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle Vacancy Status
  const handleToggleVacancy = async (id: string, currentStatus: boolean) => {
    try {
      await fetch('/api/admin/vacancies', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive: !currentStatus }),
      });
      setVacancies((prev) => prev.map((v) => (v.id === id ? { ...v, isActive: !currentStatus } : v)));
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Vacancy
  const handleDeleteVacancy = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job vacancy?')) return;
    try {
      await fetch(`/api/admin/vacancies?id=${id}`, { method: 'DELETE' });
      setVacancies((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Update Application Status
  const handleAppStatusChange = async (id: string, status: string) => {
    try {
      await fetch('/api/admin/applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
      fetchApplications();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Application
  const handleDeleteApp = async (id: string) => {
    if (!confirm('Delete this job application?')) return;
    try {
      await fetch(`/api/admin/applications?id=${id}`, { method: 'DELETE' });
      setApplications((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#180205', color: '#ffffff' }}>
        <p style={{ fontSize: '18px', fontWeight: 600 }}>Loading Vastu Vihar Admin Portal...</p>
      </div>
    );
  }

  const getCleanPhone = (phoneStr: string) => {
    const digits = phoneStr.replace(/\D/g, '');
    return digits.length === 10 ? `91${digits}` : digits;
  };

  const AVATAR_GRADIENTS = [
    'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
    'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
    'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
    'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
  ];

  const getAvatarStyle = (name: string) => {
    let hash = 0;
    const str = name || 'Customer';
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % AVATAR_GRADIENTS.length;
    return {
      background: AVATAR_GRADIENTS[index],
    };
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'NEW':
        return styles.statusNew;
      case 'CONTACTED':
        return styles.statusContacted;
      case 'FOLLOW_UP':
        return styles.statusFollowUp;
      case 'CONVERTED':
        return styles.statusConverted;
      case 'CLOSED':
        return styles.statusClosed;
      default:
        return '';
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* ================= EXACT REPLICA SIDEBAR (CRIMSON DARK) ================= */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.brandRow}>
            <Image
              src="/images/logo.svg"
              alt="Vastu Vihar"
              width={130}
              height={42}
              className={styles.brandLogoImg}
              priority
            />
            <span className={styles.portalBadge}>ADMIN PORTAL</span>
          </div>
        </div>

        <nav className={styles.sidebarNav}>
          <div className={styles.navSectionTitle}>MAIN MANAGEMENT</div>

          {/* Nav Item: Property Leads */}
          {can('leads:read') && <button
            onClick={() => setActiveTab('leads')}
            className={`${styles.navItem} ${activeTab === 'leads' ? styles.navItemActive : ''}`}
          >
            <div className={styles.navItemLeft}>
              <span className={styles.navIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4 19h4V9H4v10zm6 0h4V5h-4v14zm6 0h4v-7h-4v7z" />
                </svg>
              </span>
              <span>Property Leads</span>
            </div>
            <span className={styles.navBadge}>{leadStats.totalCount}</span>
          </button>}

          {/* Nav Item: Job Openings */}
          {can('vacancies:manage') && <button
            onClick={() => setActiveTab('vacancies')}
            className={`${styles.navItem} ${activeTab === 'vacancies' ? styles.navItemActive : ''}`}
          >
            <div className={styles.navItemLeft}>
              <span className={styles.navIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </span>
              <span>Job Openings</span>
            </div>
            <span className={styles.navBadge}>{vacancies.length}</span>
          </button>}

          {/* Nav Item: Job Applications */}
          {can('applications:read') && <button
            onClick={() => setActiveTab('applications')}
            className={`${styles.navItem} ${activeTab === 'applications' ? styles.navItemActive : ''}`}
          >
            <div className={styles.navItemLeft}>
              <span className={styles.navIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </span>
              <span>Job Applications</span>
            </div>
            <span className={styles.navBadge}>{appStats.totalCount}</span>
          </button>}
          {/* Nav Item: Blog Posts */}
          {can('blogs:manage') && <button
            onClick={() => setActiveTab('blogs')}
            className={`${styles.navItem} ${activeTab === 'blogs' ? styles.navItemActive : ''}`}
          >
            <div className={styles.navItemLeft}>
              <span className={styles.navIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </span>
              <span>Blog Posts</span>
            </div>
          </button>}

          {/* Nav Item: Privacy & Compliance */}
          {(can('privacy:read') || can('comments:moderate') || can('users:manage')) && (
            <button onClick={() => router.push('/admin/privacy/')} className={styles.navItem}>
              <div className={styles.navItemLeft}>
                <span className={styles.navIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </span>
                <span>Privacy &amp; Compliance</span>
              </div>
            </button>
          )}

          <div className={styles.navSectionTitle}>QUICK ACTIONS</div>

          {/* //blog button */}

          {can('blogs:manage') && <button onClick={() => router.push('/admin/blogs/new')} className={styles.navItem}>
            <div className={styles.navItemLeft}>
              <span className={styles.navIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </span>
              <span>Post New Blog</span>
            </div>
          </button>}



          {can('vacancies:manage') && <button onClick={() => setShowJobModal(true)} className={styles.navItem}>
            <div className={styles.navItemLeft}>
              <span className={styles.navIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </span>
              <span>Post New Job</span>
            </div>
          </button>}

          {can('leads:export') && <button onClick={exportLeadsCSV} className={styles.navItem}>
            <div className={styles.navItemLeft}>
              <span className={styles.navIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </span>
              <span>Export CSV</span>
            </div>
          </button>}
        </nav>

        <div className={styles.sidebarFooter}>
          <button className={styles.sidebarActionBtn} onClick={() => alert('Settings: Admin account authenticated')}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            <span>Settings</span>
          </button>

          <a href="/" target="_blank" rel="noreferrer" className={styles.sidebarActionBtn}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span>View Live Website</span>
          </a>


          <button onClick={handleLogout} className={`${styles.sidebarActionBtn} ${styles.logoutBtn}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ================= RIGHT WORKSPACE ================= */}
      <div className={styles.mainContent}>
        {/* Top Header Bar */}
        <header className={styles.topBar}>
          <div className={styles.topBarTitleArea}>
            <h1 className={styles.pageHeading}>Property Leads & Inquiries</h1>
            <p className={styles.pageSubheading}>Track, filter, and contact customer inquiries in real time</p>
          </div>

          <div className={styles.topBarRight}>
            <div className={styles.datePill}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>

            <button className={styles.notifBtn} title="Notifications">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className={styles.notifDot} />
            </button>

            <div className={styles.adminProfile}>
              <div className={styles.avatar}>A</div>
              <span className={styles.profileName}>Admin</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className={styles.contentArea}>
          {/* ================= TAB 1: LEADS ================= */}
          {activeTab === 'leads' && (
            <div>
              {/* Stats Cards Row (with exact sparklines) */}
              <div className={styles.statsRow}>
                {/* 1. Total Inquiries */}
                <div className={styles.statCard}>
                  <div className={styles.statLeft}>
                    <div className={styles.statIconBox} style={{ background: '#fee2e2', color: '#c8102e' }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                      </svg>
                    </div>
                    <div className={styles.statInfo}>
                      <span className={styles.statLabel}>Total Inquiries</span>
                      <span className={styles.statNumber}>{leadStats.totalCount}</span>
                      <span className={`${styles.statTrend} ${styles.statTrendDown}`}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', marginRight: '3px' }}>
                          <polyline points="7 13 12 18 17 13" />
                          <line x1="12" y1="6" x2="12" y2="18" />
                        </svg>
                        0% from last 7 days
                      </span>
                    </div>
                  </div>
                  <div className={styles.sparkline}>
                    <div className={styles.sparkBar} style={{ height: '35%', background: '#fca5a5' }} />
                    <div className={styles.sparkBar} style={{ height: '55%', background: '#fca5a5' }} />
                    <div className={styles.sparkBar} style={{ height: '80%', background: '#fca5a5' }} />
                    <div className={styles.sparkBar} style={{ height: '65%', background: '#f87171' }} />
                  </div>
                </div>

                {/* 2. New / Pending */}
                <div className={styles.statCard}>
                  <div className={styles.statLeft}>
                    <div className={styles.statIconBox} style={{ background: '#fef3c7', color: '#d97706' }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                      </svg>
                    </div>
                    <div className={styles.statInfo}>
                      <span className={styles.statLabel}>New / Pending</span>
                      <span className={styles.statNumber} style={{ color: '#0f172a' }}>
                        {leadStats.newCount}
                      </span>
                      <span className={`${styles.statTrend} ${styles.statTrendDown}`}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', marginRight: '3px' }}>
                          <polyline points="7 13 12 18 17 13" />
                          <line x1="12" y1="6" x2="12" y2="18" />
                        </svg>
                        0% from last 7 days
                      </span>
                    </div>
                  </div>
                  <div className={styles.sparkline}>
                    <div className={styles.sparkBar} style={{ height: '40%', background: '#fcd34d' }} />
                    <div className={styles.sparkBar} style={{ height: '60%', background: '#fcd34d' }} />
                    <div className={styles.sparkBar} style={{ height: '90%', background: '#fbbf24' }} />
                    <div className={styles.sparkBar} style={{ height: '70%', background: '#f59e0b' }} />
                  </div>
                </div>

                {/* 3. In Discussion */}
                <div className={styles.statCard}>
                  <div className={styles.statLeft}>
                    <div className={styles.statIconBox} style={{ background: '#f3e8ff', color: '#7e22ce' }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" />
                      </svg>
                    </div>
                    <div className={styles.statInfo}>
                      <span className={styles.statLabel}>In Discussion</span>
                      <span className={styles.statNumber} style={{ color: '#0f172a' }}>
                        {leadStats.contactedCount}
                      </span>
                      <span className={`${styles.statTrend} ${styles.statTrendDown}`}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', marginRight: '3px' }}>
                          <polyline points="7 13 12 18 17 13" />
                          <line x1="12" y1="6" x2="12" y2="18" />
                        </svg>
                        0% from last 7 days
                      </span>
                    </div>
                  </div>
                  <div className={styles.sparkline}>
                    <div className={styles.sparkBar} style={{ height: '30%', background: '#c4b5fd' }} />
                    <div className={styles.sparkBar} style={{ height: '70%', background: '#a78bfa' }} />
                    <div className={styles.sparkBar} style={{ height: '85%', background: '#8b5cf6' }} />
                    <div className={styles.sparkBar} style={{ height: '60%', background: '#7c3aed' }} />
                  </div>
                </div>

                {/* 4. Converted Deals */}
                <div className={styles.statCard}>
                  <div className={styles.statLeft}>
                    <div className={styles.statIconBox} style={{ background: '#dcfce7', color: '#16a34a' }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                    </div>
                    <div className={styles.statInfo}>
                      <span className={styles.statLabel}>Converted Deals</span>
                      <span className={styles.statNumber} style={{ color: '#0f172a' }}>
                        {leadStats.convertedCount}
                      </span>
                      <span className={`${styles.statTrend} ${styles.statTrendUp}`}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', marginRight: '3px' }}>
                          <polyline points="17 11 12 6 7 11" />
                          <line x1="12" y1="18" x2="12" y2="6" />
                        </svg>
                        0% from last 7 days
                      </span>
                    </div>
                  </div>
                  <div className={styles.sparkline}>
                    <div className={styles.sparkBar} style={{ height: '40%', background: '#86efac' }} />
                    <div className={styles.sparkBar} style={{ height: '60%', background: '#4ade80' }} />
                    <div className={styles.sparkBar} style={{ height: '85%', background: '#22c55e' }} />
                    <div className={styles.sparkBar} style={{ height: '100%', background: '#16a34a' }} />
                  </div>
                </div>
              </div>

              {/* Filter and Action Bar */}
              <div className={styles.filterBar}>
                <div className={styles.filterControls}>
                  <div className={styles.searchWrapper}>
                    <span className={styles.searchIcon}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      placeholder="Search customer name, phone, city..."
                      value={leadSearch}
                      onChange={(e) => setLeadSearch(e.target.value)}
                      className={styles.searchInput}
                    />
                  </div>

                  <select
                    value={leadFilterStatus}
                    onChange={(e) => setLeadFilterStatus(e.target.value)}
                    className={styles.filterSelect}
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="NEW">New</option>
                    <option value="CONTACTED">Contacted</option>
                    <option value="FOLLOW_UP">Follow Up</option>
                    <option value="CONVERTED">Converted</option>
                    <option value="CLOSED">Closed</option>
                  </select>

                  <select
                    value={leadFilterCity}
                    onChange={(e) => setLeadFilterCity(e.target.value)}
                    className={styles.filterSelect}
                  >
                    {CITIES_LIST.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>

                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className={styles.filterSelect}
                  >
                    <option value="ALL">Select Date Range</option>
                    <option value="TODAY">Today</option>
                    <option value="7DAYS">Last 7 Days</option>
                    <option value="30DAYS">Last 30 Days</option>
                  </select>
                </div>

                {can('leads:export') && <button onClick={exportLeadsCSV} className={styles.exportCrimsonBtn}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>Export CSV</span>
                </button>}
              </div>

              {/* Main Card (Table OR Empty State) */}
              <div className={styles.mainCard}>
                {leads.length === 0 ? (
                  /* Exact Empty State Illustration */
                  <div className={styles.emptyStateContainer}>
                    <div className={styles.emptyIconWrapper}>
                      <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <line x1="10" y1="9" x2="8" y2="9" />
                      </svg>
                    </div>

                    <h2 className={styles.emptyTitle}>No leads found</h2>
                    <p className={styles.emptySubtitle}>
                      Try adjusting your search or filter criteria to find customer inquiries.
                    </p>

                    <button onClick={handleClearFilters} className={styles.clearFilterBtn}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="4" y1="21" x2="4" y2="14" />
                        <line x1="4" y1="10" x2="4" y2="3" />
                        <line x1="12" y1="21" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12" y2="3" />
                        <line x1="20" y1="21" x2="20" y2="16" />
                        <line x1="20" y1="12" x2="20" y2="3" />
                        <line x1="1" y1="14" x2="7" y2="14" />
                        <line x1="9" y1="8" x2="15" y2="8" />
                        <line x1="17" y1="16" x2="23" y2="16" />
                      </svg>
                      <span>Clear Filters</span>
                    </button>
                  </div>
                ) : (
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Customer</th>
                        <th>Contact Actions</th>
                        <th>City / Project</th>
                        <th>Budget</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.map((lead) => {
                        const cleanPhone = getCleanPhone(lead.phone);
                        const waMsg = encodeURIComponent(
                          `Namaste ${lead.fullName}! Thank you for your inquiry with Vastu Vihar. How may we assist you with our residential homes today?`
                        );

                        return (
                          <tr key={lead.id}>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div className={styles.customerAvatar} style={getAvatarStyle(lead.fullName)}>
                                  {lead.fullName.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className={styles.customerName}>{lead.fullName}</div>
                                  <div className={styles.inquirySourceBadge}>
                                    <span className={styles.inquirySourceDot} />
                                    <span>via {(lead.source || 'website').replace(/_/g, ' ')}</span>
                                  </div>
                                  {lead.adChannel && (
                                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '3px' }}>Ad: {adSourceLabel(lead)}</div>
                                  )}
                                </div>
                              </div>
                            </td>

                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <a href={`tel:${lead.phone}`} className={styles.callPill}>
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                  </svg>
                                  <span>{lead.phone}</span>
                                </a>
                                <a
                                  href={`https://wa.me/${cleanPhone}?text=${waMsg}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className={styles.whatsappPill}
                                  title="WhatsApp Chat"
                                >
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                                  </svg>
                                  <span>WhatsApp</span>
                                </a>
                              </div>
                            </td>

                            <td>
                              <div>
                                <span className={styles.cityBadge}>
                                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                    <circle cx="12" cy="10" r="3" />
                                  </svg>
                                  <span>{lead.city || lead.project || 'General'}</span>
                                </span>
                                {lead.email && (
                                  <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '4px' }}>{lead.email}</div>
                                )}
                                <div style={{ fontSize: '11px', color: lead.marketingConsent ? '#15803d' : '#64748b', marginTop: '3px', fontWeight: 500 }}>
                                  {lead.marketingConsent ? 'Marketing OK' : 'No marketing'}
                                </div>
                              </div>
                            </td>

                            <td>
                              {lead.budget ? (
                                <span className={styles.budgetBadge}>
                                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3a4.5 4.5 0 0 0 0-9" />
                                  </svg>
                                  <span>{lead.budget}</span>
                                </span>
                              ) : (
                                <span style={{ fontSize: '12px', color: '#94a3b8' }}>—</span>
                              )}
                            </td>

                            <td>
                              <span className={styles.dateBadge}>
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                  <line x1="16" y1="2" x2="16" y2="6" />
                                  <line x1="8" y1="2" x2="8" y2="6" />
                                  <line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                                <span>{new Date(lead.createdAt).toLocaleDateString('en-GB')}</span>
                              </span>
                            </td>

                            <td>
                              <select
                                value={lead.status}
                                onChange={(e) => handleLeadStatusChange(lead.id, e.target.value)}
                                className={`${styles.statusDropdown} ${getStatusClass(lead.status)}`}
                              >
                                <option value="NEW">NEW</option>
                                <option value="CONTACTED">CONTACTED</option>
                                <option value="FOLLOW_UP">FOLLOW UP</option>
                                <option value="CONVERTED">CONVERTED</option>
                                <option value="CLOSED">CLOSED</option>
                              </select>
                            </td>

                            <td style={{ textAlign: 'right' }}>
                              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                                <button
                                  onClick={() => setSelectedLead(lead)}
                                  className={styles.viewActionBtn}
                                  title="View Customer Details"
                                >
                                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                    <circle cx="12" cy="12" r="3" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => handleDeleteLead(lead.id)}
                                  className={styles.deleteActionBtn}
                                  title="Delete Lead"
                                >
                                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="3 6 5 6 21 6" />
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}


          {/* ================= TAB 4: BLOGS ================= */}
          {activeTab === 'blogs' && (
            <div>
              <div className={styles.filterBar}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>Manage Blog Posts</h3>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>
                    Publish and manage articles on your live website.
                  </span>
                </div>
                <button onClick={() => router.push('/admin/blogs/new')} className={styles.exportCrimsonBtn}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  <span>Write New Post</span>
                </button>
              </div>

              <div className={styles.mainCard}>
                {blogs.length === 0 ? (
                  <div className={styles.emptyStateContainer}>
                    <div className={styles.emptyIconWrapper}>
                      <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                      </svg>
                    </div>
                    <h2 className={styles.emptyTitle}>Manage Your Articles</h2>
                    <p className={styles.emptySubtitle}>
                      Click "Write New Post" above to open the blog editor and publish a new article.
                    </p>
                  </div>
                ) : (
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Date Posted</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {blogs.map((blog) => (
                        <tr key={blog.id}>
                          <td>
                            <div style={{ fontWeight: 600, color: '#0f172a' }}>{blog.title}</div>
                            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>/{blog.slug}</div>
                          </td>
                          <td>
                            <span className={styles.cityBadge}>{blog.category}</span>
                          </td>
                          <td>
                            <span className={styles.dateBadge}>
                              <span>{new Date(blog.createdAt).toLocaleDateString('en-GB')}</span>
                            </span>
                          </td>
                          <td>
                            <span style={{
                              fontSize: '11.5px', fontWeight: 700, padding: '3px 8px', borderRadius: '9999px',
                              background: blog.isPublished ? '#dcfce7' : '#f1f5f9',
                              color: blog.isPublished ? '#15803d' : '#64748b'
                            }}>
                              {blog.isPublished ? 'Published' : 'Draft'}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                              <a href={`/blog/${blog.slug}`} target="_blank" rel="noreferrer" className={styles.viewActionBtn} title="View Live">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                  <circle cx="12" cy="12" r="3" />
                                </svg>
                              </a>
                              <button onClick={() => handleDeleteBlog(blog.id)} className={styles.deleteActionBtn} title="Delete Post">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="3 6 5 6 21 6" />
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}


          {/* ================= TAB 2: VACANCIES ================= */}
          {activeTab === 'vacancies' && (
            <div>
              <div className={styles.filterBar}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Manage Job Openings</h3>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>
                    Active vacancies show automatically on https://vastuvihar.com/careers
                  </span>
                </div>
                <button onClick={handleOpenCreateJob} className={styles.exportCrimsonBtn}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  <span>Post New Job</span>
                </button>
              </div>

              {vacancies.length === 0 ? (
                <div className={styles.mainCard}>
                  <div className={styles.emptyStateContainer}>
                    <div className={styles.emptyIconWrapper}>
                      <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                      </svg>
                    </div>
                    <h2 className={styles.emptyTitle}>No job openings posted</h2>
                    <p className={styles.emptySubtitle}>
                      Click "Post New Job" above to create and publish career opportunities for Vastu Vihar.
                    </p>
                    <button onClick={handleOpenCreateJob} className={styles.clearFilterBtn}>
                      + Post First Job
                    </button>
                  </div>
                </div>
              ) : (
                <div className={styles.jobCardsGrid}>
                  {vacancies.map((job) => (
                    <div key={job.id} className={styles.jobCard}>
                      <div className={styles.jobCardHeader}>
                        <div>
                          <h3 className={styles.jobCardTitle}>{job.title}</h3>
                          <div className={styles.jobPillsRow}>
                            <span className={styles.jobTag}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                <circle cx="12" cy="10" r="3" />
                              </svg>
                              <span>{job.location}</span>
                            </span>
                            <span className={styles.jobTag}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                              </svg>
                              <span>{job.type}</span>
                            </span>
                            {job.department && (
                              <span className={styles.jobTag}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
                                  <line x1="9" y1="22" x2="9" y2="12" />
                                  <line x1="15" y1="22" x2="15" y2="12" />
                                  <line x1="15" y1="6" x2="15" y2="6.01" />
                                  <line x1="9" y1="6" x2="9" y2="6.01" />
                                </svg>
                                <span>{job.department}</span>
                              </span>
                            )}
                          </div>
                        </div>

                        <span
                          style={{
                            fontSize: '11.5px',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '9999px',
                            background: job.isActive ? '#dcfce7' : '#fee2e2',
                            color: job.isActive ? '#15803d' : '#991b1b',
                          }}
                        >
                          {job.isActive ? 'Active' : 'Draft'}
                        </span>
                      </div>

                      <p className={styles.jobDesc}>{job.description}</p>

                      {job.requirements && (
                        <div style={{ fontSize: '12.5px', color: '#475569', background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', marginBottom: '14px', border: '1px solid #eef2f6' }}>
                          <strong style={{ color: '#011c5b', display: 'block', marginBottom: '4px', fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Requirements:</strong>
                          <span style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{job.requirements}</span>
                        </div>
                      )}

                      <div className={styles.jobCardFooter}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={job.isActive}
                            onChange={() => handleToggleVacancy(job.id, job.isActive)}
                          />
                          <span>{job.isActive ? 'Published on Careers' : 'Hidden / Draft'}</span>
                        </label>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={() => handleEditVacancy(job)}
                            className={styles.editActionBtn}
                            title="Edit Opening"
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 20h9" />
                              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                            </svg>
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteVacancy(job.id)}
                            className={styles.deleteActionBtn}
                            title="Delete Opening"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 3: APPLICATIONS ================= */}
          {activeTab === 'applications' && (
            <div>
              <div className={styles.statsRow}>
                <div className={styles.statCard}>
                  <div className={styles.statLeft}>
                    <div className={styles.statIconBox} style={{ background: '#fee2e2', color: '#c8102e' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
                        <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
                      </svg>
                    </div>
                    <div className={styles.statInfo}>
                      <span className={styles.statLabel}>Total Applications</span>
                      <span className={styles.statNumber}>{appStats.totalCount}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statLeft}>
                    <div className={styles.statIconBox} style={{ background: '#fef3c7', color: '#d97706' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    </div>
                    <div className={styles.statInfo}>
                      <span className={styles.statLabel}>Pending Review</span>
                      <span className={styles.statNumber}>{appStats.pendingCount}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statLeft}>
                    <div className={styles.statIconBox} style={{ background: '#dcfce7', color: '#16a34a' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </div>
                    <div className={styles.statInfo}>
                      <span className={styles.statLabel}>Shortlisted</span>
                      <span className={styles.statNumber}>{appStats.shortlistedCount}</span>
                    </div>
                  </div>
                </div>
              </div>

              {applications.length === 0 ? (
                <div className={styles.mainCard}>
                  <div className={styles.emptyStateContainer}>
                    <div className={styles.emptyIconWrapper}>
                      <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <line x1="10" y1="9" x2="8" y2="9" />
                      </svg>
                    </div>
                    <h2 className={styles.emptyTitle}>No job applications received yet</h2>
                    <p className={styles.emptySubtitle}>
                      When candidates apply from the Careers page and upload their resumes, they will appear here.
                    </p>
                  </div>
                </div>
              ) : (
                <div className={styles.appsGrid}>
                  {applications.map((app) => (
                    <div key={app.id} className={styles.appCard}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                        <div>
                          <h3 style={{ fontSize: '17px', fontWeight: 800, margin: 0 }}>{app.fullName}</h3>
                          <div className={styles.appRole}>Applied for: {app.jobTitle}</div>
                          <span style={{ fontSize: '11.5px', color: '#64748b' }}>
                            Applied on: {new Date(app.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <select
                          value={app.status}
                          onChange={(e) => handleAppStatusChange(app.id, e.target.value)}
                          className={styles.statusDropdown}
                        >
                          <option value="SUBMITTED">SUBMITTED</option>
                          <option value="REVIEWED">REVIEWED</option>
                          <option value="SHORTLISTED">SHORTLISTED</option>
                          <option value="REJECTED">REJECTED</option>
                        </select>
                      </div>

                      <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', margin: '14px 0', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div>
                          <strong>Phone:</strong>{' '}
                          <a href={`tel:${app.phone}`} className={styles.callPill}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                            </svg>
                            <span>{app.phone}</span>
                          </a>
                        </div>
                        <div>
                          <strong>Email:</strong> {app.email}
                        </div>
                        {app.experience && (
                          <div>
                            <strong>Experience:</strong> {app.experience}
                          </div>
                        )}
                        {app.coverLetter && (
                          <div style={{ marginTop: '4px' }}>
                            <strong>Note:</strong> <em>"{app.coverLetter}"</em>
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {app.resumePath ? (
                          <a
                            href={app.resumePath}
                            className={styles.resumeDownloadBtn}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                              <polyline points="7 10 12 15 17 10" />
                              <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                            <span>Download Resume</span>
                          </a>
                        ) : (
                          <span style={{ fontSize: '12px', color: '#94a3b8' }}>No Resume Attached</span>
                        )}

                        <button
                          onClick={() => handleDeleteApp(app.id)}
                          style={{ background: 'transparent', border: 'none', color: '#dc2626', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ================= MODAL: VIEW LEAD DETAILS ================= */}
      {selectedLead && (
        <div className={styles.modalBackdrop} onClick={() => setSelectedLead(null)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h2 className={styles.modalTitle}>Customer Inquiry Details</h2>
                <p className={styles.modalSubtitle}>Full lead information captured via website inquiry forms</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className={styles.modalCloseBtn}
                aria-label="Close modal"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '14px' }}>
              <div>
                <strong>Customer Name:</strong> {selectedLead.fullName}
              </div>
              <div>
                <strong>Phone Number:</strong>{' '}
                <a href={`tel:${selectedLead.phone}`} className={styles.callPill}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>{selectedLead.phone}</span>
                </a>
              </div>
              <div>
                <strong>Email Address:</strong> {selectedLead.email || 'None'}
              </div>
              <div>
                <strong>Target City / Project:</strong>{' '}
                {selectedLead.city || selectedLead.project || 'General Inquiry'}
              </div>
              <div>
                <strong>Budget Range:</strong> {selectedLead.budget || 'Not specified'}
              </div>
              <div>
                <strong>Marketing:</strong>{' '}
                {selectedLead.marketingConsent
                  ? 'Opted in. Promotional messages are allowed.'
                  : 'Not opted in. Contact only about this enquiry.'}
              </div>
              <div>
                <strong>Ad source:</strong> {adSourceLabel(selectedLead) || 'Not recorded'}
              </div>
              {selectedLead.legalHoldReason && (
                <div>
                  <strong>Legal hold:</strong> {selectedLead.legalHoldReason}
                </div>
              )}
              {selectedLead.address && (
                <div>
                  <strong>Address:</strong> {selectedLead.address}
                </div>
              )}
              {selectedLead.message && (
                <div>
                  <strong>Message from Customer:</strong>
                  <p style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', marginTop: '6px', border: '1px solid #eef2f6' }}>
                    {selectedLead.message}
                  </p>
                </div>
              )}
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                Captured on {new Date(selectedLead.createdAt).toLocaleString()} via {selectedLead.source}
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className={styles.modalBtnCancel}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: POST / EDIT JOB ================= */}
      {showJobModal && (
        <div className={styles.modalBackdrop} onClick={() => setShowJobModal(false)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h2 className={styles.modalTitle}>
                  {editingJobId ? 'Edit Job Opening' : 'Create New Job Opening'}
                </h2>
                <p className={styles.modalSubtitle}>
                  {editingJobId
                    ? 'Update the requirements and details for this career vacancy.'
                    : 'Publish an open career opportunity displayed live on vastuvihar.com/careers.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowJobModal(false)}
                className={styles.modalCloseBtn}
                aria-label="Close modal"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSaveJob} className={styles.modalForm}>
              {/* Job Title */}
              <div className={styles.modalFormGroup}>
                <label className={styles.modalLabel}>
                  <span>
                    Job Title <span className={styles.modalLabelRequired}>*</span>
                  </span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Civil Engineer / Site Supervisor"
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                  className={styles.modalInput}
                />
              </div>

              {/* 2-Column: Department & Job Type */}
              <div className={styles.modalGrid2}>
                <div className={styles.modalFormGroup}>
                  <label className={styles.modalLabel}>
                    <span>Department / Category</span>
                  </label>
                  <input
                    type="text"
                    list="job-dept-list"
                    placeholder="e.g. Civil Engineering"
                    value={jobForm.department}
                    onChange={(e) => setJobForm({ ...jobForm, department: e.target.value })}
                    className={styles.modalInput}
                  />
                  <datalist id="job-dept-list">
                    <option value="Civil Engineering" />
                    <option value="Architecture & Planning" />
                    <option value="Sales & Business Development" />
                    <option value="Site Operations & Quality" />
                    <option value="Accounts & Finance" />
                    <option value="Legal & Land Acquisition" />
                    <option value="Human Resources (HR)" />
                    <option value="Customer Relationship (CRM)" />
                  </datalist>
                </div>

                <div className={styles.modalFormGroup}>
                  <label className={styles.modalLabel}>
                    <span>Job Type</span>
                  </label>
                  <select
                    value={jobForm.type}
                    onChange={(e) => setJobForm({ ...jobForm, type: e.target.value })}
                    className={styles.modalSelect}
                  >
                    <option value="Full - Time">Full - Time</option>
                    <option value="Part - Time">Part - Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>

              {/* 2-Column: Location & Publication Status */}
              <div className={styles.modalGrid2}>
                <div className={styles.modalFormGroup}>
                  <label className={styles.modalLabel}>
                    <span>Location / City</span>
                  </label>
                  <input
                    type="text"
                    list="job-location-list"
                    placeholder="e.g. Ranchi, JH"
                    value={jobForm.location}
                    onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                    className={styles.modalInput}
                  />
                  <datalist id="job-location-list">
                    <option value="Ranchi, JH" />
                    <option value="Patna, BR" />
                    <option value="Jamshedpur, JH" />
                    <option value="Dhanbad, JH" />
                    <option value="Bokaro, JH" />
                    <option value="Muzaffarpur, BR" />
                    <option value="Gaya, BR" />
                    <option value="Bhagalpur, BR" />
                    <option value="Kolkata, WB" />
                    <option value="Bhubaneswar, OD" />
                  </datalist>
                </div>

                <div className={styles.modalFormGroup}>
                  <label className={styles.modalLabel}>
                    <span>Publication Status</span>
                  </label>
                  <select
                    value={jobForm.isActive ? 'true' : 'false'}
                    onChange={(e) => setJobForm({ ...jobForm, isActive: e.target.value === 'true' })}
                    className={styles.modalSelect}
                  >
                    <option value="true">Active (Published on Careers)</option>
                    <option value="false">Draft (Saved as Draft)</option>
                  </select>
                </div>
              </div>

              {/* Job Description */}
              <div className={styles.modalFormGroup}>
                <label className={styles.modalLabel}>
                  <span>
                    Job Description <span className={styles.modalLabelRequired}>*</span>
                  </span>
                  <span className={styles.modalLabelHint}>Overview of role & responsibilities</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe the primary responsibilities, daily work expectations, and team scope for this role..."
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  className={styles.modalTextarea}
                />
              </div>

              {/* Key Requirements */}
              <div className={styles.modalFormGroup}>
                <label className={styles.modalLabel}>
                  <span>Key Requirements & Eligibility</span>
                  <span className={styles.modalLabelHint}>One per line or bullet points</span>
                </label>
                <textarea
                  rows={4}
                  placeholder={"• 3+ years experience in residential civil construction\n• B.Tech / Diploma in Civil Engineering\n• Proficiency in AutoCAD and site execution\n• Strong team coordination and on-site vendor management"}
                  value={jobForm.requirements}
                  onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                  className={styles.modalTextarea}
                />
              </div>

              {/* Modal Actions */}
              <div className={styles.modalFooter}>
                <button
                  type="button"
                  onClick={() => setShowJobModal(false)}
                  className={styles.modalBtnCancel}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.modalBtnSubmit}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>{editingJobId ? 'Save Changes' : 'Publish Opening'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
