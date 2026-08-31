import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import bgImage from './assets/image.png';

const styles = {
    page: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `linear-gradient(135deg, rgba(23, 36, 65, 0.85), rgba(15, 23, 42, 0.9)), url(${bgImage})`,
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
        fontSize: 26,
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
        marginBottom: 32,
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
    field: {
        marginBottom: 20,
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
    loginButton: {
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
    loginButtonHover: {
        transform: 'translateY(-2px)',
        boxShadow: '0 14px 28px rgba(23, 36, 65, 0.4)',
        background: 'linear-gradient(135deg, #283d6a 0%, #1f2f52 100%)',
    },
    loginButtonDisabled: {
        opacity: 0.7,
        cursor: 'not-allowed',
        transform: 'none',
    },
    secondaryRow: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: 12,
        marginTop: 24,
    },
    secondaryButton: {
        flex: 1,
        padding: '12px 0',
        borderRadius: 10,
        border: '1px solid #e2e8f0',
        background: '#f1f5f9',
        color: '#475569',
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    secondaryButtonHover: {
        background: '#e2e8f0',
        color: '#1e293b',
        borderColor: '#cbd5e1',
    },
};

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const [hoveredBtn, setHoveredBtn] = useState(null);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRoleRedirect = (userRole) => {
        const normalizedRole = userRole?.toLowerCase().trim();

        switch (normalizedRole) {
            case 'displineofficer':
            case 'discipline':
                navigate('/DisDashboard');
                break;
            case 'admin':
                navigate('/Adminportal');
                break;
            case 'director':
                navigate('/dirdispdashbo');
                break;
            case 'student':
                navigate('/StudentDash');
                break;
            default:
                setError('Unauthorized role: access route not found.');
                break;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            const user = await login(form.email.trim().toLowerCase(), form.password);
            const role = user?.role || user?.user?.role;
            
            if (role) {
                handleRoleRedirect(role);
            } else {
                setError('User account has no designated role.');
            }
        } catch (err) {
            setError(err.message || 'Invalid email or password');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <div style={styles.topAccent} />
                
                <div style={styles.badgeRing}>
                    <div style={styles.badge}>K</div>
                </div>

                <h2 style={styles.title}>Welcome Back</h2>
                <p style={styles.subtitle}>Karenga Adventist Secondary School</p>

                {error && <div style={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit}>
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
                        />
                    </div>

                    <button
                        type="submit"
                        style={{
                            ...styles.loginButton,
                            ...(hoveredBtn === 'login' && !submitting ? styles.loginButtonHover : {}),
                            ...(submitting ? styles.loginButtonDisabled : {}),
                        }}
                        onMouseEnter={() => setHoveredBtn('login')}
                        onMouseLeave={() => setHoveredBtn(null)}
                        disabled={submitting}
                    >
                        {submitting ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>

                <div style={styles.secondaryRow}>
                    <button
                        type="button"
                        style={{
                            ...styles.secondaryButton,
                            ...(hoveredBtn === 'forgot' ? styles.secondaryButtonHover : {}),
                        }}
                        onMouseEnter={() => setHoveredBtn('forgot')}
                        onMouseLeave={() => setHoveredBtn(null)}
                        onClick={() => navigate('/resetpass')}
                    >
                        Forgot Password
                    </button>
                    <button
                        type="button"
                        style={{
                            ...styles.secondaryButton,
                            ...(hoveredBtn === 'signup' ? styles.secondaryButtonHover : {}),
                        }}
                        onMouseEnter={() => setHoveredBtn('signup')}
                        onMouseLeave={() => setHoveredBtn(null)}
                        onClick={() => navigate('/signup')}
                    >
                        Create Account
                    </button>
                </div>
            </div>
        </div>
    );
}