import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        {/* Logo */}
        <Link to="/" style={styles.logo}>
          <span style={styles.logoIcon}>📖</span>
          <span>Page<span style={{ color: 'var(--accent)' }}>Turn</span></span>
        </Link>

        {/* Desktop links */}
        <div style={styles.links}>
          <Link to="/" style={{ ...styles.link, ...(isActive('/') ? styles.linkActive : {}) }}>Home</Link>
          <Link to="/books" style={{ ...styles.link, ...(isActive('/books') ? styles.linkActive : {}) }}>Browse</Link>
          {user && <Link to="/shelf" style={{ ...styles.link, ...(isActive('/shelf') ? styles.linkActive : {}) }}>My Shelf</Link>}
        </div>

        {/* Auth buttons */}
        <div style={styles.auth}>
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin" style={{ ...styles.btn, background: 'rgba(232,197,71,0.15)', color: 'var(--accent)', marginRight: 8 }}>
                  Admin
                </Link>
              )}
              <div style={styles.userChip}>
                <div style={styles.avatar}>{user.name[0].toUpperCase()}</div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text2)' }} className="hide-mobile">{user.name}</span>
              </div>
              <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.btn}>Login</Link>
              <Link to="/register" style={{ ...styles.btn, background: 'var(--accent)', color: 'var(--bg)', fontWeight: 600 }}>Sign Up</Link>
            </>
          )}

          {/* Hamburger */}
          <button style={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={styles.mobileMenu}>
          <Link to="/" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/books" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Browse Books</Link>
          {user && <Link to="/shelf" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>My Shelf</Link>}
          {user?.role === 'admin' && <Link to="/admin" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Admin Dashboard</Link>}
          {user ? (
            <button onClick={handleLogout} style={{ ...styles.mobileLink, background: 'none', border: 'none', textAlign: 'left', color: '#f87171', cursor: 'pointer' }}>Logout</button>
          ) : (
            <>
              <Link to="/login" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

const styles = {
  nav: {
    position: 'sticky', top: 0, zIndex: 100,
    background: 'rgba(15,14,23,0.92)',
    backdropFilter: 'blur(16px)',
    borderBottom: '1px solid var(--border)',
  },
  inner: {
    maxWidth: 1200, margin: '0 auto',
    padding: '0 24px',
    height: 64,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  logo: {
    display: 'flex', alignItems: 'center', gap: 8,
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.4rem', fontWeight: 700,
    color: 'var(--text)',
  },
  logoIcon: { fontSize: '1.5rem' },
  links: { display: 'flex', gap: 8, alignItems: 'center' },
  link: {
    padding: '6px 14px', borderRadius: 6,
    color: 'var(--text2)', fontSize: '0.9rem', fontWeight: 500,
    transition: 'all 0.2s',
  },
  linkActive: { color: 'var(--text)', background: 'var(--surface)' },
  auth: { display: 'flex', alignItems: 'center', gap: 8 },
  btn: {
    padding: '7px 16px', borderRadius: 8,
    border: '1px solid var(--border)',
    color: 'var(--text)', fontSize: '0.85rem',
    transition: 'all 0.2s', display: 'inline-block',
  },
  userChip: { display: 'flex', alignItems: 'center', gap: 8 },
  avatar: {
    width: 32, height: 32, borderRadius: '50%',
    background: 'var(--accent)', color: 'var(--bg)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 700, fontSize: '0.85rem',
  },
  logoutBtn: {
    padding: '7px 14px', borderRadius: 8,
    background: 'transparent', border: '1px solid var(--border)',
    color: 'var(--text2)', fontSize: '0.85rem', cursor: 'pointer',
  },
  hamburger: {
    display: 'none', background: 'none', border: 'none',
    color: 'var(--text)', fontSize: '1.3rem', cursor: 'pointer',
    padding: '4px 8px',
    '@media (max-width: 768px)': { display: 'block' }
  },
  mobileMenu: {
    display: 'flex', flexDirection: 'column',
    background: 'var(--bg2)', borderTop: '1px solid var(--border)',
    padding: '8px 0',
  },
  mobileLink: {
    padding: '12px 24px', color: 'var(--text2)',
    fontSize: '0.95rem', fontWeight: 500,
    borderBottom: '1px solid var(--border)',
    display: 'block',
  },
};
