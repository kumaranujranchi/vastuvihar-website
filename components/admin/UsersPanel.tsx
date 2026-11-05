'use client';

import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { api, useLoad, when } from './adminApi';
import styles from './UsersPanel.module.css';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLoginAt: string | null;
  lockedUntil: string | null;
};

type Status = 'Active' | 'Disabled' | 'Locked';
type Notice = { kind: 'success' | 'error'; text: string };
type Dialog =
  | { type: 'add' }
  | { type: 'password'; user: User }
  | { type: 'access'; user: User };

const ROLE_DETAILS: Record<string, { label: string; description: string }> = {
  SUPER_ADMIN: { label: 'Super admin', description: 'Full access, including managing users.' },
  PRIVACY_OFFICER: { label: 'Privacy officer', description: 'Privacy requests, compliance records and the audit log.' },
  SALES: { label: 'Sales', description: 'Leads and lead exports.' },
  HR: { label: 'HR', description: 'Vacancies and job applications.' },
  CONTENT: { label: 'Content', description: 'Blog, gallery, comments and newsletter.' },
};

const roleLabel = (role: string) => ROLE_DETAILS[role]?.label || role;

const EMPTY_FORM = { name: '', email: '', role: 'SALES', password: '' };

function statusOf(user: User): Status {
  if (!user.isActive) return 'Disabled';
  if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) return 'Locked';
  return 'Active';
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] || '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase() || '?';
}

function Modal({ title, description, onClose, children }: {
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  return (
    <dialog ref={ref} className={styles.dialog} aria-labelledby="users-dialog-title" onClose={onClose}>
      <div className={styles.dialogHeader}>
        <div>
          <h2 id="users-dialog-title" className={styles.dialogTitle}>{title}</h2>
          {description && <p className={styles.dialogDescription}>{description}</p>}
        </div>
        <button type="button" className={styles.dialogClose} aria-label="Close" onClick={() => ref.current?.close()}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      {children}
    </dialog>
  );
}

export default function UsersPanel({ currentId }: { currentId: string }) {
  const { data, error, reload } = useLoad<{ users: User[]; roles: string[] }>('/api/admin/users');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dialog, setDialog] = useState<Dialog | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [dialogError, setDialogError] = useState('');
  const [notice, setNotice] = useState<Notice | null>(null);

  const users = useMemo(() => data?.users ?? [], [data]);
  const roles = data?.roles ?? [];
  const loading = !data && !error;

  const counts = useMemo(() => {
    const total = { Active: 0, Disabled: 0, Locked: 0 };
    users.forEach((user) => { total[statusOf(user)] += 1; });
    return total;
  }, [users]);

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    return users.filter((user) =>
      (!query || user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query)) &&
      (roleFilter === 'ALL' || user.role === roleFilter) &&
      (statusFilter === 'ALL' || statusOf(user) === statusFilter));
  }, [users, search, roleFilter, statusFilter]);

  function openDialog(next: Dialog) {
    setDialogError('');
    setPassword('');
    setForm(EMPTY_FORM);
    setDialog(next);
  }

  // Runs a change from a dialog. The dialog stays open on failure so nothing typed is lost.
  async function submit(event: FormEvent, action: () => Promise<unknown>, done: string) {
    event.preventDefault();
    setBusy(true);
    setDialogError('');
    try {
      await action();
      setNotice({ kind: 'success', text: done });
      setDialog(null);
      await reload();
    } catch (err) {
      setDialogError((err as Error).message);
    }
    setBusy(false);
  }

  async function changeRole(user: User, role: string) {
    setNotice(null);
    try {
      await api('/api/admin/users', 'PATCH', { id: user.id, role });
      setNotice({ kind: 'success', text: `${user.name} is now ${roleLabel(role)} and has been signed out.` });
    } catch (err) {
      setNotice({ kind: 'error', text: (err as Error).message });
    }
    // Also puts the dropdown back to the saved role if the change failed.
    await reload();
  }

  const stats: { label: string; value: number }[] = [
    { label: 'Total users', value: users.length },
    { label: 'Active', value: counts.Active },
    { label: 'Disabled', value: counts.Disabled },
    { label: 'Locked', value: counts.Locked },
  ];

  return (
    <div className={styles.panel}>
      <div className={styles.stats}>
        {stats.map((stat) => (
          <div key={stat.label} className={styles.stat}>
            <span className={styles.statLabel}>{stat.label}</span>
            <span className={styles.statValue}>{loading ? '–' : stat.value}</span>
          </div>
        ))}
      </div>

      <section className={styles.card} aria-label="Users">
        <div className={styles.toolbar}>
          <div className={styles.filters}>
            <label className={styles.search}>
              <span className={styles.srOnly}>Search users</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input type="search" placeholder="Search name or email" value={search} onChange={(e) => setSearch(e.target.value)} />
            </label>
            <select className={styles.select} aria-label="Filter by role" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
              <option value="ALL">All roles</option>
              {roles.map((role) => <option key={role} value={role}>{roleLabel(role)}</option>)}
            </select>
            <select className={styles.select} aria-label="Filter by status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="ALL">All statuses</option>
              <option value="Active">Active</option>
              <option value="Disabled">Disabled</option>
              <option value="Locked">Locked</option>
            </select>
          </div>
          <button type="button" className={styles.primary} onClick={() => openDialog({ type: 'add' })}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add user
          </button>
        </div>

        {(error || notice) && (
          <p role={error || notice?.kind === 'error' ? 'alert' : 'status'} className={`${styles.notice} ${error || notice?.kind === 'error' ? styles.noticeError : styles.noticeSuccess}`}>
            {error || notice?.text}
          </p>
        )}

        {loading && <p className={styles.state}>Loading users…</p>}

        {!loading && !error && visible.length === 0 && (
          <div className={styles.state}>
            <p className={styles.stateTitle}>{users.length ? 'No users match your filters' : 'No users yet'}</p>
            <p>{users.length ? 'Try a different search, role or status.' : 'Add the first user to give someone access to the admin panel.'}</p>
          </div>
        )}

        {visible.length > 0 && (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">User</th>
                  <th scope="col">Role</th>
                  <th scope="col">Status</th>
                  <th scope="col">Last sign-in</th>
                  <th scope="col"><span className={styles.srOnly}>Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {visible.map((user) => {
                  const status = statusOf(user);
                  const isSelf = user.id === currentId;
                  return (
                    <tr key={user.id}>
                      <td>
                        <div className={styles.user}>
                          <span className={styles.avatar} aria-hidden="true">{initials(user.name)}</span>
                          <div className={styles.userText}>
                            <span className={styles.userName}>
                              {user.name}
                              {isSelf && <span className={styles.you}>You</span>}
                            </span>
                            <span className={styles.userEmail}>{user.email}</span>
                          </div>
                        </div>
                      </td>
                      <td data-label="Role">
                        <select
                          className={styles.roleSelect}
                          aria-label={`Role for ${user.name}`}
                          title={ROLE_DETAILS[user.role]?.description}
                          value={user.role}
                          disabled={isSelf}
                          onChange={(e) => changeRole(user, e.target.value)}
                        >
                          {roles.map((role) => <option key={role} value={role}>{roleLabel(role)}</option>)}
                        </select>
                      </td>
                      <td data-label="Status">
                        <span className={`${styles.status} ${styles[`status${status}`]}`}>{status}</span>
                      </td>
                      <td data-label="Last sign-in" className={styles.muted}>{user.lastLoginAt ? when(user.lastLoginAt) : 'Never'}</td>
                      <td className={styles.actionsCell}>
                        <div className={styles.actions}>
                          <button type="button" className={styles.action} aria-label={`Reset password for ${user.name}`} onClick={() => openDialog({ type: 'password', user })}>
                            Reset password
                          </button>
                          {!isSelf && (
                            <button
                              type="button"
                              className={`${styles.action} ${user.isActive ? styles.actionDanger : ''}`}
                              aria-label={`${user.isActive ? 'Disable' : 'Enable'} ${user.name}`}
                              onClick={() => openDialog({ type: 'access', user })}
                            >
                              {user.isActive ? 'Disable' : 'Enable'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {visible.length > 0 && (
          <p className={styles.footer}>Showing {visible.length} of {users.length} {users.length === 1 ? 'user' : 'users'}</p>
        )}
      </section>

      {dialog?.type === 'add' && (
        <Modal title="Add user" description="They can sign in straight away with this temporary password." onClose={() => setDialog(null)}>
          <form
            className={styles.form}
            onSubmit={(event) => submit(event, () => api('/api/admin/users', 'POST', form), `${form.name} can now sign in.`)}
          >
            <label className={styles.field}>
              <span>Full name</span>
              <input required maxLength={120} autoFocus value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </label>
            <label className={styles.field}>
              <span>Work email</span>
              <input type="email" required autoComplete="off" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </label>
            <label className={styles.field}>
              <span>Role</span>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                {roles.map((role) => <option key={role} value={role}>{roleLabel(role)}</option>)}
              </select>
              <small>{ROLE_DETAILS[form.role]?.description}</small>
            </label>
            <label className={styles.field}>
              <span>Temporary password</span>
              <input type="password" required minLength={12} autoComplete="new-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              <small>At least 12 characters.</small>
            </label>
            {dialogError && <p role="alert" className={`${styles.notice} ${styles.noticeError} ${styles.dialogNotice}`}>{dialogError}</p>}
            <div className={styles.dialogActions}>
              <button type="button" className={styles.secondary} onClick={() => setDialog(null)}>Cancel</button>
              <button type="submit" className={styles.primary} disabled={busy}>{busy ? 'Adding…' : 'Add user'}</button>
            </div>
          </form>
        </Modal>
      )}

      {dialog?.type === 'password' && (
        <Modal title="Reset password" description={`${dialog.user.name} will be signed out and must use the new password.`} onClose={() => setDialog(null)}>
          <form
            className={styles.form}
            onSubmit={(event) => submit(event, () => api('/api/admin/users', 'PATCH', { id: dialog.user.id, password }), `Password changed for ${dialog.user.name}.`)}
          >
            <label className={styles.field}>
              <span>New password</span>
              <input type="password" required minLength={12} autoFocus autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <small>At least 12 characters.</small>
            </label>
            {dialogError && <p role="alert" className={`${styles.notice} ${styles.noticeError} ${styles.dialogNotice}`}>{dialogError}</p>}
            <div className={styles.dialogActions}>
              <button type="button" className={styles.secondary} onClick={() => setDialog(null)}>Cancel</button>
              <button type="submit" className={styles.primary} disabled={busy}>{busy ? 'Saving…' : 'Reset password'}</button>
            </div>
          </form>
        </Modal>
      )}

      {dialog?.type === 'access' && (
        <Modal
          title={dialog.user.isActive ? `Disable ${dialog.user.name}?` : `Enable ${dialog.user.name}?`}
          description={dialog.user.isActive
            ? 'They will be signed out and won’t be able to sign in until you enable them again.'
            : 'They will be able to sign in again with their existing password.'}
          onClose={() => setDialog(null)}
        >
          <form
            className={styles.form}
            onSubmit={(event) => submit(
              event,
              () => api('/api/admin/users', 'PATCH', { id: dialog.user.id, isActive: !dialog.user.isActive }),
              `${dialog.user.name} has been ${dialog.user.isActive ? 'disabled' : 'enabled'}.`,
            )}
          >
            {dialogError && <p role="alert" className={`${styles.notice} ${styles.noticeError} ${styles.dialogNotice}`}>{dialogError}</p>}
            <div className={styles.dialogActions}>
              <button type="button" className={styles.secondary} onClick={() => setDialog(null)}>Cancel</button>
              <button type="submit" className={dialog.user.isActive ? styles.danger : styles.primary} disabled={busy}>
                {dialog.user.isActive ? 'Disable user' : 'Enable user'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
