import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import bgImage from './assets/image.png';

const styles = {
    page: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justify: 'center',
        backgroundImage: `linear-gradient(160deg, rgba(20,15,35,0.65), rgba(20,15,35,0.35) 40%, rgba(20,15,35,0.7)), url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        fontFamily: "'Segoe UI', Roboto, Arial, sans-serif",
        padding: '20px',
    },
    card: {
        width: '100%',
        maxWidth: 400,
        background: 'rgba(255, 255, 255, 0.92)',
        borderRadius: 20,
        padding: '40px 34px',
        boxShadow: '0 25px 60px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.4) inset',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
    },
    badge: {
        width: 56,
        height: 56,
        borderRadius: 14,
        margin: '0 auto 18px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontSize: 24,
        fontWeight: 700,
        boxShadow: '0 8px 20px rgba(118,75,162,0.4)',
    },
    title: {
        margin: 0,
        marginBottom: 6,
        fontSize: 26,
        fontWeight: 700,
        color: '#211f2e',
        textAlign: 'center',
        letterSpacing: '-0.3px',
    },
    subtitle: {
        margin: 0,
        marginBottom: 28,
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
        border: '1px solid #f5c6c0',
    },
    field: {
        marginBottom: 18,
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
        padding: '13px 14px',
        borderRadius: 10,
        border: '1.5px solid #e0e0e8',
        fontSize: 14,
        outline: 'none',
        background: '#fafafd',
        color: '#2d2d3a',
        transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s',
    },
    inputFocus: {
        borderColor: '#764ba2',
        boxShadow: '0 0 0 4px rgba(118,75,162,0.12)',
        background: '#ffffff',
    },
    loginButton: {
        width: '100%',
        padding: '14px 0',
        borderRadius: 10,
        border: 'none',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        fontSize: 15,
        fontWeight: 600,
        cursor: 'pointer',
        marginTop: 10,
        boxShadow: '0 10px 20px rgba(118,75,162,0.35)',
        transition: 'transform 0.15s, box-shadow 0.15s',
    },
    loginButtonHover: {
        transform: 'translateY(-2px)',
        boxShadow: '0 14px 26px rgba(118,75,162,0.45)',
    },
    loginButtonDisabled: {
        opacity: 0.7,
        cursor: 'not-allowed',
        transform: 'none',
    },
    secondaryRow: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: 10,
        marginTop: 20,
    },
    secondaryButton: {
        flex: 1,
        padding: '11px 0',
        borderRadius: 10,
        border: '1px solid #e0e0e8',
        background: '#f8f8fb',
        color: '#4a4a58',
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'background 0.2s, border-color 0.2s',
    },
    secondaryButtonHover: {
        background: '#eeeef5',
        borderColor: '#c9c9d6',
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
            
            // Check for user role either returned directly from login() or inside user context object
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
                <div style={styles.badge}>K</div>
                <h2 style={styles.title}>Welcome Back</h2>
                <p style={styles.subtitle}>Log in to continue</p>

                {error && <div style={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={styles.field}>
                        <label style={styles.label}>Email</label>
                        <input
                            style={{
                                ...styles.input,
                                ...(focusedField === 'email' ? styles.inputFocus : {}),
                            }}
                            type="email"
                            name="email"
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
                        {submitting ? 'Logging in...' : 'Log In'}
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
                        Sign Up
                    </button>
                </div>
            </div>
        </div>
    );
}