import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);
const API_BASE = 'https://kass-checking-backend.vercel.app/api/v1/auth';

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    const fetchCurrentUser = async () => {
        try {
            const res = await fetch(`${API_BASE}/me`, {
                credentials: 'include', // sends the httpOnly cookie
            });
            if (res.ok) {
                const user = await res.json();
                setCurrentUser(user);
            } else {
                setCurrentUser(null);
            }
        } catch {
            setCurrentUser(null);
        } finally {
            setAuthLoading(false);
        }
    };

    useEffect(() => {
        fetchCurrentUser();
    }, []);

    const login = async (email, password) => {
        const res = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.error || 'Login failed');
        }
        setCurrentUser(data.user);
        return data.user;
    };

    const logout = async () => {
        await fetch(`${API_BASE}/logout`, {
            method: 'POST',
            credentials: 'include',
        });
        setCurrentUser(null);
    };

    return (
        <AuthContext.Provider value={{ currentUser, authLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
    return ctx;
}