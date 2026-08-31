import React, { useState, useEffect, useMemo } from 'react';
import AdminSidebar from './AdminSidebar';
import './AdminUsersPortal.css';

const API_BASE = 'https://kass-checking-backend.vercel.app/api/v1';
const ROLES = ['admin', 'director', 'displineofficer'];

const emptyForm = { full_name: '', email: '', password: '', role: 'displineofficer' };

export default function AdminUsersPortal() {
    const [users, setUsers] = useState([]);
    const [studentsCount, setStudentsCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionError, setActionError] = useState(null);

    const [roleFilter, setRoleFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchAll();
    }, []);

    const fetchAll = async () => {
        try {
            setLoading(true);
            setError(null);

            const usersRes = await fetch(`${API_BASE}/users`, { credentials: 'include' });
            if (!usersRes.ok) throw new Error('Failed to fetch users list');
            const usersData = await usersRes.json();
            setUsers(usersData || []);

            const studentsRes = await fetch(`${API_BASE}/students-list`, { credentials: 'include' });
            if (studentsRes.ok) {
                const studentsData = await studentsRes.json();
                setStudentsCount(studentsData.length || 0);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const stats = useMemo(() => {
        const byRole = { admin: 0, director: 0, displineofficer: 0 };
        users.forEach((u) => {
            if (byRole[u.role] !== undefined) byRole[u.role] += 1;
        });
        return {
            total: users.length,
            admins: byRole.admin,
            directors: byRole.director,
            officers: byRole.displineofficer,
        };
    }, [users]);

    const filteredUsers = users.filter((u) => {
        const matchesRole = roleFilter === 'all' || u.role === roleFilter;
        const q = searchTerm.toLowerCase().trim();
        const matchesSearch =
            !q ||
            (u.full_name || '').toLowerCase().includes(q) ||
            (u.email || '').toLowerCase().includes(q);
        return matchesRole && matchesSearch;
    });

    const openCreateModal = () => {
        setModalMode('create');
        setForm(emptyForm);
        setEditingId(null);
        setActionError(null);
        setModalOpen(true);
    };

    const openEditModal = (user) => {
        setModalMode('edit');
        setForm({ full_name: user.full_name, email: user.email, password: '', role: user.role });
        setEditingId(user.id);
        setActionError(null);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setForm(emptyForm);
        setEditingId(null);
        setActionError(null);
    };

    const handleFormChange = (field) => (e) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setActionError(null);
        try {
            if (modalMode === 'create') {
                const res = await fetch(`${API_BASE}/auth/signup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(form),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Failed to create account');
            } else {
                const payload = {
                    full_name: form.full_name,
                    email: form.email,
                    role: form.role,
                };
                if (form.password) payload.password = form.password;

                const res = await fetch(`${API_BASE}/user/${editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(payload),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Failed to update user');
            }

            closeModal();
            fetchAll();
        } catch (err) {
            setActionError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (user) => {
        if (!window.confirm(`Remove ${user.full_name}'s account? This can't be undone.`)) return;
        try {
            const res = await fetch(`${API_BASE}/user/${user.id}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to delete user');
            fetchAll();
        } catch (err) {
            alert(err.message);
        }
    };

    const roleBadgeClass = (role) => {
        if (role === 'admin') return 'adm-role-admin';
        if (role === 'director') return 'adm-role-director';
        return 'adm-role-officer';
    };

    const roleLabel = (role) => {
        if (role === 'displineofficer') return 'Discipline Officer';
        if (role === 'director') return 'Director';
        if (role === 'admin') return 'Admin';
        return role;
    };

    if (loading) {
        return (
            <div className="adm-layout">
                <AdminSidebar />
                <div className="adm-state-container">Loading system users…</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="adm-layout">
                <AdminSidebar />
                <div className="adm-state-container adm-error-state">⚠️ {error}</div>
            </div>
        );
    }

    return (
        <div className="adm-layout">
            <AdminSidebar />

            <main className="adm-main">
                <header className="adm-page-header">
                    <div>
                        <p className="adm-eyebrow">System Oversight</p>
                        <h1 className="adm-title">Admin Portal</h1>
                        <p className="adm-subtitle">Monitor accounts and access across the KASS platform</p>
                    </div>
                    <button className="adm-add-btn" onClick={openCreateModal}>
                        + New Account
                    </button>
                </header>

                {/* Stat cards */}
                <section className="adm-stats-grid">
                    <div className="adm-stat-card">
                        <div className="adm-stat-accent adm-accent-slate" />
                        <p className="adm-stat-label">Total Accounts</p>
                        <p className="adm-stat-value">{stats.total}</p>
                    </div>
                    <div className="adm-stat-card">
                        <div className="adm-stat-accent adm-accent-indigo" />
                        <p className="adm-stat-label">Admins</p>
                        <p className="adm-stat-value adm-value-indigo">{stats.admins}</p>
                    </div>
                    <div className="adm-stat-card">
                        <div className="adm-stat-accent adm-accent-amber" />
                        <p className="adm-stat-label">Directors</p>
                        <p className="adm-stat-value adm-value-amber">{stats.directors}</p>
                    </div>
                    <div className="adm-stat-card">
                        <div className="adm-stat-accent adm-accent-emerald" />
                        <p className="adm-stat-label">Discipline Officers</p>
                        <p className="adm-stat-value adm-value-emerald">{stats.officers}</p>
                    </div>
                    <div className="adm-stat-card">
                        <div className="adm-stat-accent adm-accent-rose" />
                        <p className="adm-stat-label">Students on Record</p>
                        <p className="adm-stat-value adm-value-rose">{studentsCount}</p>
                    </div>
                </section>

                {/* Users table */}
                <section className="adm-panel">
                    <div className="adm-panel-header">
                        <div>
                            <h2 className="adm-panel-title">User Accounts</h2>
                            <p className="adm-panel-subtitle">All staff with access to the system</p>
                        </div>
                        <div className="adm-panel-controls">
                            <input
                                type="text"
                                placeholder="Search by name or email…"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="adm-search-input"
                            />
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="adm-role-select"
                            >
                                <option value="all">All Roles</option>
                                <option value="admin">Admins</option>
                                <option value="director">Directors</option>
                                <option value="displineofficer">Discipline Officers</option>
                            </select>
                        </div>
                    </div>

                    <div className="adm-table-responsive">
                        <table className="adm-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Joined</th>
                                    <th className="adm-col-actions">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="adm-empty-row">
                                            No accounts match your search.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((u) => (
                                        <tr key={u.id}>
                                            <td className="adm-cell-name">{u.full_name}</td>
                                            <td className="adm-cell-email">{u.email}</td>
                                            <td>
                                                <span className={`adm-role-badge ${roleBadgeClass(u.role)}`}>
                                                    {roleLabel(u.role)}
                                                </span>
                                            </td>
                                            <td className="adm-cell-date">
                                                {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                                            </td>
                                            <td>
                                                <div className="adm-row-actions">
                                                    <button className="adm-btn-edit" onClick={() => openEditModal(u)}>
                                                        Edit
                                                    </button>
                                                    <button className="adm-btn-delete" onClick={() => handleDelete(u)}>
                                                        Remove
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>

            {modalOpen && (
                <div className="adm-modal-overlay" onClick={closeModal}>
                    <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
                        <h3 className="adm-modal-title">
                            {modalMode === 'create' ? 'Create Account' : 'Edit Account'}
                        </h3>

                        <form onSubmit={handleSubmit} className="adm-form">
                            <label className="adm-form-label">
                                Full name
                                <input
                                    type="text"
                                    required
                                    value={form.full_name}
                                    onChange={handleFormChange('full_name')}
                                    className="adm-form-input"
                                />
                            </label>

                            <label className="adm-form-label">
                                Email
                                <input
                                    type="email"
                                    required
                                    value={form.email}
                                    onChange={handleFormChange('email')}
                                    className="adm-form-input"
                                />
                            </label>

                            <label className="adm-form-label">
                                {modalMode === 'create' ? 'Password' : 'New password (optional)'}
                                <input
                                    type="password"
                                    required={modalMode === 'create'}
                                    value={form.password}
                                    onChange={handleFormChange('password')}
                                    className="adm-form-input"
                                    placeholder={modalMode === 'edit' ? 'Leave blank to keep current password' : ''}
                                />
                            </label>

                            <label className="adm-form-label">
                                Role
                                <select
                                    value={form.role}
                                    onChange={handleFormChange('role')}
                                    className="adm-form-input"
                                >
                                    {ROLES.map((r) => (
                                        <option key={r} value={r}>
                                            {roleLabel(r)}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            {actionError && <p className="adm-form-error">{actionError}</p>}

                            <div className="adm-modal-actions">
                                <button type="button" className="adm-btn-cancel" onClick={closeModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="adm-btn-save" disabled={saving}>
                                    {saving ? 'Saving…' : modalMode === 'create' ? 'Create Account' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}