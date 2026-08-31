import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminSidebar.css';

const NAV_ITEMS = [
    { to: '/Adminportal', label: 'Overview', icon: '📊', end: true },
    // { to: '/admin/users', label: 'Manage Users', icon: '👥' },
    // { to: '/admin/students', label: 'Students Directory', icon: '🎓' },
    // { to: '/admin/materials', label: 'Materials Config', icon: '📦' },
    // { to: '/admin/signup-codes', label: 'Signup Codes', icon: '🔑' },
];

export default function AdminSidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const toggleSidebar = () => {
        setIsOpen((prev) => !prev);
    };

    const closeSidebar = () => {
        setIsOpen(false);
    };

    const displayName = currentUser ? currentUser.full_name : 'Admin';
    const initials = displayName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase();

    return (
        <>
            {/* Mobile Hamburger Toggle Button */}
            <button
                className="adsb-hamburger"
                onClick={toggleSidebar}
                aria-label="Toggle Navigation"
                aria-expanded={isOpen}
            >
                {isOpen ? '✕' : '☰'}
            </button>

            {/* Backdrop overlay for mobile screen view */}
            {isOpen && <div className="adsb-backdrop" onClick={closeSidebar} />}

            <aside className={`adsb-sidebar ${isOpen ? 'open' : ''}`}>
                <div className="adsb-brand">
                    <div className="adsb-brand-mark">KASS</div>
                    <div>
                        <p className="adsb-brand-title">Admin Console</p>
                        <p className="adsb-brand-subtitle">System Oversight</p>
                    </div>
                </div>

                <nav className="adsb-nav">
                    {NAV_ITEMS.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            onClick={closeSidebar}
                            className={({ isActive }) =>
                                `adsb-nav-item${isActive ? ' active' : ''}`
                            }
                        >
                            <span className="adsb-nav-icon">{item.icon}</span>
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="adsb-footer">
                    <div className="adsb-user-card">
                        <span className="adsb-avatar">{initials}</span>
                        <div className="adsb-user-info">
                            <p className="adsb-user-name">{displayName}</p>
                            <p className="adsb-user-role">{currentUser?.role || 'admin'}</p>
                        </div>
                    </div>
                    <button className="adsb-logout-btn" onClick={handleLogout}>
                        Log out
                    </button>
                </div>
            </aside>
        </>
    );
}