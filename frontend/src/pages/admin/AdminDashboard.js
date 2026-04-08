import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('https://book-store-webapp-kappa.vercel.app/api/admin/stats')
      .then(r => setStats(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner" />;

  const cards = [
    { label: 'Total Users', value: stats.totalUsers, icon: '👥', color: '#7c5cff', link: '/admin/users' },
    { label: 'Total Books', value: stats.totalBooks, icon: '📚', color: '#e8c547', link: '/admin/books' },
    { label: 'Active Rentals', value: stats.activeRentals, icon: '🔄', color: '#4ade80', link: '/admin/rentals' },
    { label: 'Total Rentals', value: stats.totalRentals, icon: '📋', color: '#ff7c5c', link: '/admin/rentals' },
    { label: 'Overdue', value: stats.overdueRentals, icon: '⚠️', color: '#f87171', link: '/admin/rentals' },
  ];

  return (
    <div className="page-enter">
      <h2 style={styles.title}>Dashboard Overview</h2>

      {/* Stat Cards */}
      <div style={styles.statsGrid}>
        {cards.map(c => (
          <Link to={c.link} key={c.label} style={styles.statCard}>
            <div style={{ ...styles.statIcon, background: c.color + '22', color: c.color }}>
              {c.icon}
            </div>
            <div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{c.label}</p>
              <p style={{ fontSize: '2rem', fontWeight: 700, fontFamily: "'Playfair Display', serif", color: c.color }}>{c.value}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Genre breakdown */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Books by Genre</h3>
        <div style={styles.genreGrid}>
          {stats.genreStats.map(g => (
            <div key={g._id} style={styles.genreRow}>
              <span style={styles.genreName}>{g._id}</span>
              <div style={styles.barWrap}>
                <div
                  style={{
                    ...styles.bar,
                    width: `${(g.count / Math.max(...stats.genreStats.map(x => x.count))) * 100}%`
                  }}
                />
              </div>
              <span style={styles.genreCount}>{g.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div style={styles.quickLinks}>
        <h3 style={styles.sectionTitle}>Quick Actions</h3>
        <div style={styles.quickGrid}>
          <Link to="/admin/books" style={styles.quickCard}>
            <span style={{ fontSize: '2rem', marginBottom: 10, display: 'block' }}>➕</span>
            <span style={{ fontWeight: 600 }}>Add New Book</span>
          </Link>
          <Link to="/admin/rentals" style={styles.quickCard}>
            <span style={{ fontSize: '2rem', marginBottom: 10, display: 'block' }}>👁️</span>
            <span style={{ fontWeight: 600 }}>View All Rentals</span>
          </Link>
          <Link to="/admin/users" style={styles.quickCard}>
            <span style={{ fontSize: '2rem', marginBottom: 10, display: 'block' }}>👤</span>
            <span style={{ fontWeight: 600 }}>Manage Users</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  title: { fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', marginBottom: 28 },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: 16, marginBottom: 32,
  },
  statCard: {
    display: 'flex', alignItems: 'center', gap: 16,
    background: 'var(--bg2)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', padding: '20px',
    transition: 'border-color 0.2s, transform 0.2s',
    textDecoration: 'none', color: 'inherit',
  },
  statIcon: {
    width: 48, height: 48, borderRadius: 12,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1.4rem', flexShrink: 0,
  },
  section: {
    background: 'var(--bg2)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', padding: 24, marginBottom: 24,
  },
  sectionTitle: { fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', marginBottom: 20 },
  genreGrid: { display: 'flex', flexDirection: 'column', gap: 10 },
  genreRow: { display: 'flex', alignItems: 'center', gap: 12 },
  genreName: { width: 100, fontSize: '0.85rem', color: 'var(--text2)', flexShrink: 0 },
  barWrap: { flex: 1, height: 8, background: 'var(--bg3)', borderRadius: 4, overflow: 'hidden' },
  bar: { height: '100%', background: 'var(--accent)', borderRadius: 4, transition: 'width 0.6s ease' },
  genreCount: { width: 30, textAlign: 'right', fontSize: '0.85rem', color: 'var(--text3)' },
  quickLinks: {
    background: 'var(--bg2)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', padding: 24,
  },
  quickGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 16 },
  quickCard: {
    background: 'var(--bg3)', border: '1px solid var(--border)',
    borderRadius: 12, padding: '24px 16px', textAlign: 'center',
    transition: 'all 0.2s', textDecoration: 'none', color: 'var(--text)',
    display: 'block',
  },
};
