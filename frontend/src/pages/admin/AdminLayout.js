import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const NAV = [
  { path: '/admin', label: 'Dashboard', icon: '📊', exact: true },
  { path: '/admin/books', label: 'Books', icon: '📚' },
  { path: '/admin/users', label: 'Users', icon: '👥' },
  { path: '/admin/rentals', label: 'Rentals', icon: '🔄' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/');
  };

  const isActive = (nav) => nav.exact ? location.pathname === nav.path : location.pathname.startsWith(nav.path) && nav.path !== '/admin';

  return (
    <div style={styles.layout}>
      {/* Sidebar */}
      <aside style={{ ...styles.sidebar, ...(sidebarOpen ? styles.sidebarOpen : {}) }}>
        <div style={styles.sidebarLogo}>
          <span style={{ fontSize: '1.4rem' }}>📖</span>
          <span style={styles.logoText}>PageTurn <span style={{ color: 'var(--accent)', fontSize: '0.7rem' }}>ADMIN</span></span>
        </div>

        <nav style={styles.sidebarNav}>
          {NAV.map(nav => {
            const active = nav.exact ? location.pathname === nav.path : location.pathname === nav.path;
            return (
              <Link
                key={nav.path}
                to={nav.path}
                style={{ ...styles.navItem, ...(active ? styles.navItemActive : {}) }}
                onClick={() => setSidebarOpen(false)}
              >
                <span>{nav.icon}</span>
                <span>{nav.label}</span>
              </Link>
            );
          })}
        </nav>

        <div style={styles.sidebarFooter}>
          <div style={styles.adminInfo}>
            <div style={styles.adminAvatar}>{user?.name[0]}</div>
            <div>
              <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user?.name}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>Administrator</p>
            </div>
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          <Link to="/" style={{ ...styles.logoutBtn, textAlign: 'center', display: 'block', marginTop: 8 }}>
            ← Back to Site
          </Link>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div style={styles.overlay} onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <main style={styles.main}>
        <div style={styles.topbar}>
          <button style={styles.menuBtn} onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
          <h2 style={styles.pageLabel}>
            {NAV.find(n => n.exact ? location.pathname === n.path : location.pathname === n.path)?.label || 'Admin'}
          </h2>
          <div style={styles.topbarRight}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text2)' }}>admin@admin.com</span>
          </div>
        </div>
        <div style={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

const styles = {
  layout: { display: 'flex', minHeight: '100vh', background: 'var(--bg)' },
  sidebar: {
    width: 240, background: 'var(--bg2)',
    borderRight: '1px solid var(--border)',
    display: 'flex', flexDirection: 'column',
    position: 'fixed', top: 0, left: 0, height: '100vh',
    zIndex: 200,
    transition: 'transform 0.3s',
    transform: 'translateX(-100%)',
  },
  sidebarOpen: { transform: 'translateX(0)' },
  sidebarLogo: {
    padding: '20px 20px 16px',
    display: 'flex', alignItems: 'center', gap: 10,
    borderBottom: '1px solid var(--border)',
    fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 700,
  },
  logoText: { display: 'flex', flexDirection: 'column' },
  sidebarNav: { flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 4 },
  navItem: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '11px 14px', borderRadius: 10,
    color: 'var(--text2)', fontSize: '0.9rem', fontWeight: 500,
    transition: 'all 0.15s',
  },
  navItemActive: {
    background: 'rgba(232,197,71,0.12)',
    color: 'var(--accent)',
    border: '1px solid rgba(232,197,71,0.2)',
  },
  sidebarFooter: { padding: '16px', borderTop: '1px solid var(--border)' },
  adminInfo: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 },
  adminAvatar: {
    width: 36, height: 36, borderRadius: '50%',
    background: 'var(--accent)', color: 'var(--bg)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 700,
  },
  logoutBtn: {
    width: '100%', padding: '9px',
    background: 'var(--bg3)', border: '1px solid var(--border)',
    borderRadius: 8, color: 'var(--text2)',
    cursor: 'pointer', fontSize: '0.85rem',
  },
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 150,
  },
  main: { flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' },
  topbar: {
    position: 'sticky', top: 0, zIndex: 100,
    background: 'rgba(15,14,23,0.95)', backdropFilter: 'blur(12px)',
    borderBottom: '1px solid var(--border)',
    padding: '0 24px', height: 60,
    display: 'flex', alignItems: 'center', gap: 16,
  },
  menuBtn: {
    background: 'none', border: 'none', color: 'var(--text)',
    fontSize: '1.4rem', cursor: 'pointer', padding: '4px 8px',
  },
  pageLabel: {
    fontFamily: "'Playfair Display', serif", fontSize: '1.15rem', flex: 1,
  },
  topbarRight: { display: 'flex', alignItems: 'center', gap: 12 },
  content: { padding: '28px 24px', flex: 1, maxWidth: 1200, width: '100%', margin: '0 auto' },
};
