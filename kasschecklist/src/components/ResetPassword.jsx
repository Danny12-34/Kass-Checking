import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

export default function ResetPassword() {
    const [form, setForm] = useState({
        email: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleReset = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (form.newPassword !== form.confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const targetEmail = form.email.trim().toLowerCase();
            const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');

            // Find the user index in the registered users array
            const userIndex = existingUsers.findIndex(user => user.email === targetEmail);

            if (userIndex === -1) {
                setError('No account found with this email address.');
                setLoading(false);
                return;
            }

            // Update the user's password
            existingUsers[userIndex].password = form.newPassword;
            localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));

            setSuccess('Password successfully updated! Redirecting to login...');
            setForm({ email: '', newPassword: '', confirmPassword: '' });

            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError('An error occurred while resetting your password.');
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

                <h2 style={styles.title}>Reset Password</h2>
                <p style={styles.subtitle}>Enter your email and new password</p>

                {error && <div style={styles.error}>{error}</div>}
                {success && <div style={styles.success}>{success}</div>}

                <form onSubmit={handleReset}>
                    <div style={styles.field}>
                        <label style={styles.label}>Email Address</label>
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
                        <label style={styles.label}>New Password</label>
                        <input
                            style={styles.input}
                            type="password"
                            name="newPassword"
                            value={form.newPassword}
                            onChange={handleChange}
                            required
                            minLength={6}
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Confirm New Password</label>
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
                        {loading ? 'Updating...' : 'Reset Password'}
                    </button>
                </form>

                <p style={styles.footerText}>
                    Remembered your password?{' '}
                    <button type="button" style={styles.footerLink} onClick={() => navigate('/login')}>
                        Log In
                    </button>
                </p>
            </div>
        </div>
    );
}