import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/login', form);
      login(data);
      toast.success(`Welcome back, ${data.name}!`);
      navigate(data.role === 'admin' ? '/admin' : '/books');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logoWrap}>
          <span style={{ fontSize: '2rem' }}>📖</span>
          <h1 style={styles.logoText}>PageTurn</h1>
        </div>
        <h2 style={styles.title}>Welcome back</h2>
        <p style={styles.sub}>Sign in to continue reading</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              style={styles.input}
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              style={styles.input}
              required
            />
          </div>
          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={styles.hint}>
          <p style={{ color: 'var(--text3)', fontSize: '0.8rem', marginBottom: 8 }}>
            Admin credentials: admin@admin.com / admin@123
          </p>
        </div>

        <p style={styles.footer}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--accent)' }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    padding: 24,
    background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(232,197,71,0.06) 0%, transparent 70%)',
  },
  card: {
    width: '100%', maxWidth: 420,
    background: 'var(--bg2)', border: '1px solid var(--border)',
    borderRadius: 20, padding: '40px 36px',
  },
  logoWrap: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 },
  logoText: { fontFamily: "'Playfair Display', serif", fontSize: '1.5rem' },
  title: { fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', marginBottom: 8 },
  sub: { color: 'var(--text2)', marginBottom: 28, fontSize: '0.9rem' },
  form: { display: 'flex', flexDirection: 'column', gap: 18 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: '0.85rem', fontWeight: 600, color: 'var(--text2)' },
  input: {
    padding: '11px 14px',
    background: 'var(--bg3)', border: '1px solid var(--border)',
    borderRadius: 10, color: 'var(--text)', fontSize: '0.95rem',
  },
  submitBtn: {
    padding: '13px', marginTop: 4,
    background: 'var(--accent)', color: 'var(--bg)',
    borderRadius: 10, fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
  },
  hint: {
    marginTop: 16, padding: '12px', borderRadius: 8,
    background: 'rgba(232,197,71,0.06)', border: '1px solid rgba(232,197,71,0.15)',
    textAlign: 'center',
  },
  footer: { textAlign: 'center', color: 'var(--text2)', fontSize: '0.9rem', marginTop: 20 },
};
