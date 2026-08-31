import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'https://kass-checking-backend.vercel.app/api/v1';

const styles = {
    page: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        fontFamily: "'Segoe UI', Roboto, Arial, sans-serif",
        padding: '20px',
    },
    card: {
        width: '100%',
        maxWidth: 420,
        background: '#ffffff',
        borderRadius: 16,
        padding: '36px 32px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
    },
    brand: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 20,
    },
    badge: {
        width: 56,
        height: 56,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 20,
        fontWeight: 800,
        letterSpacing: 0.5,
        marginBottom: 10,
        boxShadow: '0 8px 16px rgba(118,75,162,0.35)',
    },
    schoolName: {
        margin: 0,
        fontSize: 15,
        fontWeight: 700,
        color: '#764ba2',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    title: {
        margin: 0,
        marginBottom: 6,
        fontSize: 26,
        fontWeight: 700,
        color: '#2d2d3a',
        textAlign: 'center',
    },
    subtitle: {
        margin: 0,
        marginBottom: 24,
        fontSize: 14,
        color: '#8a8a99',
        textAlign: 'center',
    },
    error: {
        background: '#fdecea',
        color: '#c0392b',
        padding: '10px 14px',
        borderRadius: 8,
        fontSize: 13,
        marginBottom: 16,
        textAlign: 'center',
    },
    success: {
        background: '#eafaf1',
        color: '#1e8449',
        padding: '10px 14px',
        borderRadius: 8,
        fontSize: 13,
        marginBottom: 16,
        textAlign: 'center',
    },
    field: {
        marginBottom: 16,
        display: 'flex',
        flexDirection: 'column',
    },
    label: {
        fontSize: 13,
        fontWeight: 600,
        color: '#4a4a58',
        marginBottom: 6,
    },
    input: {
        padding: '12px 14px',
        borderRadius: 10,
        border: '1px solid #e0e0e8',
        fontSize: 14,
        outline: 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s',
    },
    submitButton: {
        width: '100%',
        padding: '13px 0',
        borderRadius: 10,
        border: 'none',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        fontSize: 15,
        fontWeight: 600,
        cursor: 'pointer',
        marginTop: 8,
        boxShadow: '0 8px 16px rgba(118,75,162,0.3)',
        transition: 'opacity 0.2s',
    },
    footerText: {
        marginTop: 20,
        textAlign: 'center',
        fontSize: 13,
        color: '#8a8a99',
    },
    footerLink: {
        color: '#764ba2',
        fontWeight: 600,
        cursor: 'pointer',
        background: 'none',
        border: 'none',
        fontSize: 13,
        padding: 0,
        textDecoration: 'underline',
    },
};

const DEFAULT_ROLE = 'displineofficer';

export default function SignUp({ onSuccess }) {
    const [form, setForm] = useState({
        full_name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    full_name: form.full_name.trim(),
                    email: form.email.trim().toLowerCase(),
                    password: form.password,
                    role: DEFAULT_ROLE,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Signup failed');
            }

            // Login is frontend-only, so save this account locally for Login to check against.
            const existing = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
            existing.push({
                email: form.email.trim().toLowerCase(),
                password: form.password,
                full_name: form.full_name.trim(),
                role: data.user.role,
            });
            localStorage.setItem('registeredUsers', JSON.stringify(existing));

            setSuccess('Account created! You can now log in.');
            setForm({ full_name: '', email: '', password: '', confirmPassword: '' });

            if (onSuccess) onSuccess(data.user);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <div style={styles.brand}>
                    <div style={styles.badge}>KS</div>
                    <p style={styles.schoolName}>KASS</p>
                </div>

                <h2 style={styles.title}>Create Account</h2>
                <p style={styles.subtitle}>Sign up to get started</p>

                {error && <div style={styles.error}>{error}</div>}
                {success && <div style={styles.success}>{success}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={styles.field}>
                        <label style={styles.label}>Full Name</label>
                        <input
                            style={styles.input}
                            name="full_name"
                            value={form.full_name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Email</label>
                        <input
                            style={styles.input}
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Password</label>
                        <input
                            style={styles.input}
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            minLength={6}
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Confirm Password</label>
                        <input
                            style={styles.input}
                            type="password"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            required
                            minLength={6}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{ ...styles.submitButton, opacity: loading ? 0.7 : 1 }}
                    >
                        {loading ? 'Creating account...' : 'Sign Up'}
                    </button>
                </form>

                <p style={styles.footerText}>
                    Already have an account?{' '}
                    <button type="button" style={styles.footerLink} onClick={() => navigate('/login')}>
                        Log In
                    </button>
                </p>
            </div>
        </div>
    );
}