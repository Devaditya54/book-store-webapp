import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import BookCard from '../components/BookCard';

const GENRES = ['Fiction', 'Fantasy', 'Mystery', 'Science', 'History', 'Technology', 'Self-Help', 'Biography', 'Romance'];

export default function Home() {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/books?limit=8')
      .then(r => setFeaturedBooks(r.data.books))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-enter">
      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroBg} />
        <div style={styles.heroContent}>
          <p style={styles.heroEyebrow}>📚 Your Digital Library</p>
          <h1 style={styles.heroTitle}>
            Rent Books,<br />
            <span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>Expand Worlds</span>
          </h1>
          <p style={styles.heroSub}>
            Discover thousands of books across every genre. Rent for days, return anytime. Build your personal reading shelf.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/books" className="btn-primary" style={{ padding: '13px 32px', fontSize: '1rem', borderRadius: 10 }}>
              Browse Books →
            </Link>
            <Link to="/register" className="btn-outline" style={{ padding: '13px 32px', fontSize: '1rem', borderRadius: 10 }}>
              Join Free
            </Link>
          </div>
          <div style={styles.heroStats}>
            <div style={styles.stat}><span style={styles.statNum}>1200+</span><span style={styles.statLabel}>Books</span></div>
            <div style={styles.statDivider} />
            <div style={styles.stat}><span style={styles.statNum}>50+</span><span style={styles.statLabel}>Genres</span></div>
            <div style={styles.statDivider} />
            <div style={styles.stat}><span style={styles.statNum}>₹2/day</span><span style={styles.statLabel}>Starting at</span></div>
          </div>
        </div>
        <div style={styles.heroVisual} className="hide-mobile">
          <div style={styles.bookStack}>
            {['#e8c547', '#ff7c5c', '#7c5cff', '#5cffe8'].map((c, i) => (
              <div key={i} style={{ ...styles.bookSpine, background: c, transform: `rotate(${(i - 1.5) * 6}deg) translateY(${i % 2 === 0 ? -8 : 8}px)` }} />
            ))}
          </div>
        </div>
      </section>

      {/* Genre chips */}
      <section style={styles.section}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>Browse by Genre</h2>
          <div style={styles.genreGrid}>
            {GENRES.map(g => (
              <Link key={g} to={`/books?genre=${g}`} style={styles.genreChip}>
                <span style={styles.genreEmoji}>{genreEmoji(g)}</span>
                <span>{g}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section style={styles.section}>
        <div style={styles.container}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={styles.sectionTitle}>Featured Books</h2>
            <Link to="/books" style={{ color: 'var(--accent)', fontSize: '0.9rem' }}>View all →</Link>
          </div>
          {loading ? <div className="spinner" /> : (
            <div style={styles.bookGrid}>
              {featuredBooks.map(book => <BookCard key={book._id} book={book} />)}
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section style={{ ...styles.section, background: 'var(--bg2)', padding: '60px 0' }}>
        <div style={styles.container}>
          <h2 style={{ ...styles.sectionTitle, textAlign: 'center', marginBottom: 40 }}>How It Works</h2>
          <div style={styles.stepsGrid}>
            {[
              { icon: '👤', title: 'Create Account', desc: 'Sign up for free in seconds. No credit card required.' },
              { icon: '🔍', title: 'Find Your Book', desc: 'Browse or search from our extensive collection.' },
              { icon: '📦', title: 'Rent & Collect', desc: 'Add to your shelf. Rent for as many days as you need.' },
              { icon: '🔄', title: 'Return Anytime', desc: 'Return when done or extend your rental period.' },
            ].map((step, i) => (
              <div key={i} style={styles.step}>
                <div style={styles.stepIcon}>{step.icon}</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", marginBottom: 8 }}>{step.title}</h3>
                <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ ...styles.section, textAlign: 'center', padding: '80px 24px' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginBottom: 16 }}>
          Start Reading Today
        </h2>
        <p style={{ color: 'var(--text2)', marginBottom: 32, maxWidth: 500, margin: '0 auto 32px' }}>
          Join thousands of readers on PageTurn. Your next favorite book is just a click away.
        </p>
        <Link to="/register" className="btn-primary" style={{ padding: '14px 40px', fontSize: '1.05rem', borderRadius: 12 }}>
          Get Started Free
        </Link>
      </section>
    </div>
  );
}

const genreEmoji = (g) => ({ Fiction: '📖', Fantasy: '🧙', Mystery: '🔍', Science: '🔬', History: '🏛️', Technology: '💻', 'Self-Help': '🌱', Biography: '👤', Romance: '💝' }[g] || '📚');

const styles = {
  hero: {
    position: 'relative', overflow: 'hidden',
    minHeight: '90vh', display: 'flex', alignItems: 'center',
    padding: '80px 24px',
  },
  heroBg: {
    position: 'absolute', inset: 0, zIndex: 0,
    background: 'radial-gradient(ellipse 80% 60% at 70% 50%, rgba(232,197,71,0.08) 0%, transparent 70%), radial-gradient(ellipse 60% 80% at 10% 80%, rgba(124,92,255,0.06) 0%, transparent 70%)',
  },
  heroContent: { position: 'relative', zIndex: 1, maxWidth: 600 },
  heroEyebrow: {
    display: 'inline-block', padding: '6px 16px',
    background: 'rgba(232,197,71,0.12)', border: '1px solid rgba(232,197,71,0.25)',
    borderRadius: 20, color: 'var(--accent)', fontSize: '0.85rem', fontWeight: 600,
    marginBottom: 20, letterSpacing: 1,
  },
  heroTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
    lineHeight: 1.1, fontWeight: 700, marginBottom: 20,
  },
  heroSub: { color: 'var(--text2)', fontSize: '1.05rem', marginBottom: 32, maxWidth: 480, lineHeight: 1.7 },
  heroStats: { display: 'flex', alignItems: 'center', gap: 24, marginTop: 40 },
  stat: { display: 'flex', flexDirection: 'column', gap: 2 },
  statNum: { fontFamily: "'Playfair Display', serif", fontSize: '1.6rem', fontWeight: 700, color: 'var(--accent)' },
  statLabel: { fontSize: '0.78rem', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 1 },
  statDivider: { width: 1, height: 40, background: 'var(--border)' },
  heroVisual: {
    position: 'absolute', right: '5%', top: '50%', transform: 'translateY(-50%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  bookStack: { display: 'flex', gap: 12, padding: 40 },
  bookSpine: {
    width: 60, height: 200, borderRadius: 6,
    boxShadow: '4px 4px 20px rgba(0,0,0,0.5)',
    transition: 'transform 0.3s',
  },
  section: { padding: '60px 0' },
  container: { maxWidth: 1200, margin: '0 auto', padding: '0 24px' },
  sectionTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, marginBottom: 24,
  },
  genreGrid: { display: 'flex', flexWrap: 'wrap', gap: 12 },
  genreChip: {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '10px 20px', borderRadius: 40,
    background: 'var(--bg2)', border: '1px solid var(--border)',
    color: 'var(--text2)', fontSize: '0.9rem', fontWeight: 500,
    transition: 'all 0.2s',
  },
  genreEmoji: { fontSize: '1.1rem' },
  bookGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: 20,
  },
  stepsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 24,
  },
  step: {
    background: 'var(--bg3)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', padding: 28, textAlign: 'center',
  },
  stepIcon: { fontSize: '2.5rem', marginBottom: 16 },
};
