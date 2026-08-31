import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bgImage from './assets/image.png'; // Make sure the path matches your project structure

const API_BASE = 'https://kass-checking-backend.vercel.app/api/v1';

const styles = {
    page: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `linear-gradient(135deg, rgba(23, 36, 65, 0.75), rgba(15, 23, 42, 0.82)), url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        fontFamily: "'Inter', 'Segoe UI', Roboto, sans-serif",
        padding: '20px',
    },
    card: {
        width: '100%',
        maxWidth: 420,
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 24,
        padding: '44px 38px',
        boxShadow: '0 30px 60px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(232, 199, 102, 0.3) inset',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        position: 'relative',
        overflow: 'hidden',
    },
    topAccent: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, #8a6d1f 0%, #e8c766 50%, #c9a227 100%)',
    },
    badgeRing: {
        width: 64,
        height: 64,
        borderRadius: '50%',
        padding: '3px',
        background: 'linear-gradient(135deg, #e8c766, #8a6d1f)',
        margin: '0 auto 20px',
        boxShadow: '0 8px 20px rgba(201, 162, 39, 0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    badge: {
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        background: '#172441',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#e8c766',
        fontSize: 24,
        fontWeight: 700,
        fontFamily: "'Playfair Display', Georgia, serif",
    },
    title: {
        margin: 0,
        marginBottom: 6,
        fontSize: 28,
        fontWeight: 700,
        color: '#1a2744',
        textAlign: 'center',
        letterSpacing: '-0.5px',
        fontFamily: "'Playfair Display', Georgia, serif",
    },
    subtitle: {
        margin: 0,
        marginBottom: 28,
        fontSize: 14,
        color: '#64748b',
        textAlign: 'center',
        fontWeight: 500,
    },
    error: {
        background: '#fef2f2',
        color: '#dc2626',
        padding: '12px 16px',
        borderRadius: 10,
        fontSize: 13,
        fontWeight: 500,
        marginBottom: 20,
        textAlign: 'center',
        border: '1px solid #fecaca',
    },
    success: {
        background: '#f0fdf4',
        color: '#16a34a',
        padding: '12px 16px',
        borderRadius: 10,
        fontSize: 13,
        fontWeight: 500,
        marginBottom: 20,
        textAlign: 'center',
        border: '1px solid #bbf7d0',
    },
    field: {
        marginBottom: 18,
        display: 'flex',
        flexDirection: 'column',
    },
    label: {
        fontSize: 13,
        fontWeight: 600,
        color: '#334155',
        marginBottom: 8,
        letterSpacing: '0.02em',
    },
    input: {
        padding: '14px 16px',
        borderRadius: 12,
        border: '1.5px solid #cbd5e1',
        fontSize: 14,
        outline: 'none',
        background: '#f8fafc',
        color: '#1e293b',
        transition: 'all 0.2s ease',
    },
    inputFocus: {
        borderColor: '#c9a227',
        boxShadow: '0 0 0 4px rgba(232, 199, 102, 0.2)',
        background: '#ffffff',
    },
    submitButton: {
        width: '100%',
        padding: '15px 0',
        borderRadius: 12,
        border: 'none',
        background: 'linear-gradient(135deg, #1f2f52 0%, #172441 100%)',
        color: '#f5f1e6',
        fontSize: 15,
        fontWeight: 600,
        cursor: 'pointer',
        marginTop: 8,
        boxShadow: '0 10px 25px rgba(23, 36, 65, 0.3)',
        transition: 'all 0.2s ease',
        letterSpacing: '0.03em',
    },
    submitButtonHover: {
        transform: 'translateY(-2px)',
        boxShadow: '0 14px 28px rgba(23, 36, 65, 0.4)',
        background: 'linear-gradient(135deg, #283d6a 0%, #1f2f52 100%)',
    },
    submitButtonDisabled: {
        opacity: 0.7,
        cursor: 'not-allowed',
        transform: 'none',
    },
    footerText: {
        marginTop: 24,
        textAlign: 'center',
        fontSize: 13,
        color: '#64748b',
        fontWeight: 500,
    },
    footerLink: {
        color: '#172441',
        fontWeight: 700,
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
    const [focusedField, setFocusedField] = useState(null);
    const [isHovered, setIsHovered] = useState(false);
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

            const existing = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
            existing.push({
                email: form.email.trim().toLowerCase(),
                password: form.password,
                full_name: form.full_name.trim(),
                role: data.user.role,
            });
            localStorage.setItem('registeredUsers', JSON.stringify(existing));

            setSuccess('Account created successfully! Redirecting...');
            setForm({ full_name: '', email: '', password: '', confirmPassword: '' });

            if (onSuccess) onSuccess(data.user);
            
            setTimeout(() => {
                navigate('/Login');
            }, 1500);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <div style={styles.topAccent} />

                <div style={styles.badgeRing}>
                    <div style={styles.badge}>K</div>
                </div>

                <h2 style={styles.title}>Create Account</h2>
                <p style={styles.subtitle}>Karenga Adventist Secondary School</p>

                {error && <div style={styles.error}>{error}</div>}
                {success && <div style={styles.success}>{success}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={styles.field}>
                        <label style={styles.label}>Full Name</label>
                        <input
                            style={{
                                ...styles.input,
                                ...(focusedField === 'full_name' ? styles.inputFocus : {}),
                            }}
                            name="full_name"
                            placeholder="John Doe"
                            value={form.full_name}
                            onChange={handleChange}
                            onFocus={() => setFocusedField('full_name')}
                            onBlur={() => setFocusedField(null)}
                            required
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Email Address</label>
                        <input
                            style={{
                                ...styles.input,
                                ...(focusedField === 'email' ? styles.inputFocus : {}),
                            }}
                            type="email"
                            name="email"
                            placeholder="name@school.com"
                            value={form.email}
                            onChange={handleChange}
                            onFocus={() => setFocusedField('email')}
                            onBlur={() => setFocusedField(null)}
                            required
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Password</label>
                        <input
                            style={{
                                ...styles.input,
                                ...(focusedField === 'password' ? styles.inputFocus : {}),
                            }}
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={handleChange}
                            onFocus={() => setFocusedField('password')}
                            onBlur={() => setFocusedField(null)}
                            required
                            minLength={6}
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Confirm Password</label>
                        <input
                            style={{
                                ...styles.input,
                                ...(focusedField === 'confirmPassword' ? styles.inputFocus : {}),
                            }}
                            type="password"
                            name="confirmPassword"
                            placeholder="••••••••"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            onFocus={() => setFocusedField('confirmPassword')}
                            onBlur={() => setFocusedField(null)}
                            required
                            minLength={6}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            ...styles.submitButton,
                            ...(isHovered && !loading ? styles.submitButtonHover : {}),
                            ...(loading ? styles.submitButtonDisabled : {}),
                        }}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        {loading ? 'Creating account...' : 'Sign Up'}
                    </button>
                </form>

                <p style={styles.footerText}>
                    Already have an account?{' '}
                    <button type="button" style={styles.footerLink} onClick={() => navigate('/Login')}>
                        Log In
                    </button>
                </p>
            </div>
        </div>
    );
}