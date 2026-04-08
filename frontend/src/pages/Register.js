import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/register', {
        name: form.name, email: form.email, password: form.password
      });
      login(data);
      toast.success(`Welcome to PageTurn, ${data.name}! 🎉`);
      navigate('/books');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
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
        <h2 style={styles.title}>Create account</h2>
        <p style={styles.sub}>Start your reading journey today</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          {[
            { key: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
            { key: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
            { key: 'password', label: 'Password', type: 'password', placeholder: 'Min 6 characters' },
            { key: 'confirm', label: 'Confirm Password', type: 'password', placeholder: 'Repeat password' },
          ].map(({ key, label, type, placeholder }) => (
            <div key={key} style={styles.field}>
              <label style={styles.label}>{label}</label>
              <input
                type={type}
                value={form[key]}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                placeholder={placeholder}
                style={styles.input}
                required
              />
            </div>
          ))}
          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent)' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh', display: 'flex',
    alignItems: 'center', justifyContent: 'center', padding: 24,
    background: 'radial-gradient(ellipse 60% 60% at 50% 30%, rgba(124,92,255,0.05) 0%, transparent 70%)',
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
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
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
  footer: { textAlign: 'center', color: 'var(--text2)', fontSize: '0.9rem', marginTop: 24 },
};
