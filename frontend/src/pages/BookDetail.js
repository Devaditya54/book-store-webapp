import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function BookDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [renting, setRenting] = useState(false);
  const [days, setDays] = useState(14);

  useEffect(() => {
    axios.get(`https://book-store-webapp-kappa.vercel.app/api/books/${id}`)
      .then(r => setBook(r.data))
      .catch(() => toast.error('Book not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleRent = async () => {
    if (!user) { navigate('/login'); return; }
    setRenting(true);
    try {
      await axios.post('https://book-store-webapp-kappa.vercel.app/api/rentals', { bookId: id, days });
      toast.success('Book rented! Check your shelf 📚');
      setBook(prev => ({ ...prev, availableCopies: prev.availableCopies - 1 }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Rental failed');
    } finally {
      setRenting(false);
    }
  };

  if (loading) return <div className="spinner" style={{ marginTop: 80 }} />;
  if (!book) return <div style={{ textAlign: 'center', padding: 80 }}>Book not found</div>;

  const stars = '★'.repeat(Math.round(book.rating)) + '☆'.repeat(5 - Math.round(book.rating));
  const totalCost = (book.rentPrice * days).toFixed(2);

  return (
    <div style={styles.page} className="page-enter">
      <div style={styles.container}>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>← Back</button>

        <div style={styles.layout}>
          {/* Cover */}
          <div style={styles.coverWrap}>
            <img
              src={book.coverImage || `https://via.placeholder.com/300x420/232136/e8c547?text=📖`}
              alt={book.title}
              style={styles.cover}
              onError={e => { e.target.src = `https://via.placeholder.com/300x420/232136/e8c547?text=📖`; }}
            />
          </div>

          {/* Details */}
          <div style={styles.details}>
            <span className="badge badge-genre">{book.genre}</span>
            <h1 style={styles.title}>{book.title}</h1>
            <p style={styles.author}>by <strong>{book.author}</strong></p>

            <div style={styles.meta}>
              <span style={{ color: 'var(--accent)' }}>{stars}</span>
              <span style={{ color: 'var(--text3)', fontSize: '0.85rem' }}>({book.rating}/5)</span>
              {book.publishedYear && <span style={styles.metaItem}>• {book.publishedYear}</span>}
              {book.language && <span style={styles.metaItem}>• {book.language}</span>}
            </div>

            <p style={styles.description}>{book.description}</p>

            {/* Stats */}
            <div style={styles.statsRow}>
              <div style={styles.statBox}>
                <span style={styles.statValue}>{book.totalCopies}</span>
                <span style={styles.statLabel}>Total Copies</span>
              </div>
              <div style={styles.statBox}>
                <span style={{ ...styles.statValue, color: book.availableCopies > 0 ? '#4ade80' : '#f87171' }}>
                  {book.availableCopies}
                </span>
                <span style={styles.statLabel}>Available</span>
              </div>
              <div style={styles.statBox}>
                <span style={{ ...styles.statValue, color: 'var(--accent)' }}>₹{book.rentPrice}</span>
                <span style={styles.statLabel}>Per Day</span>
              </div>
            </div>

            {/* Rental form */}
            {book.availableCopies > 0 ? (
              <div style={styles.rentalBox}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", marginBottom: 16 }}>Rent This Book</h3>
                <div style={styles.daysRow}>
                  <label style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>Duration:</label>
                  <div style={styles.dayBtns}>
                    {[7, 14, 21, 30].map(d => (
                      <button
                        key={d}
                        onClick={() => setDays(d)}
                        style={{ ...styles.dayBtn, ...(days === d ? styles.dayBtnActive : {}) }}
                      >
                        {d} days
                      </button>
                    ))}
                  </div>
                </div>
                <div style={styles.costRow}>
                  <span style={{ color: 'var(--text2)' }}>Total Cost:</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent)' }}>₹{totalCost}</span>
                </div>
                <button
                  onClick={handleRent}
                  disabled={renting}
                  style={styles.rentBtn}
                >
                  {renting ? 'Processing...' : '📚 Rent Now'}
                </button>
                {!user && <p style={{ fontSize: '0.8rem', color: 'var(--text3)', marginTop: 8 }}>You must be logged in to rent</p>}
              </div>
            ) : (
              <div style={styles.unavailableBox}>
                <span style={{ fontSize: '1.5rem' }}>😔</span>
                <p style={{ fontWeight: 600, marginBottom: 4 }}>Currently Unavailable</p>
                <p style={{ color: 'var(--text2)', fontSize: '0.85rem' }}>All copies are currently rented. Check back later!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', padding: '40px 0' },
  container: { maxWidth: 1100, margin: '0 auto', padding: '0 24px' },
  backBtn: {
    background: 'var(--bg2)', border: '1px solid var(--border)',
    color: 'var(--text2)', padding: '8px 16px', borderRadius: 8,
    cursor: 'pointer', marginBottom: 32, fontSize: '0.9rem',
  },
  layout: {
    display: 'grid', gridTemplateColumns: 'auto 1fr',
    gap: 48, alignItems: 'start',
    '@media(max-width:768px)': { gridTemplateColumns: '1fr' },
  },
  coverWrap: {
    width: 280, borderRadius: 'var(--radius)',
    overflow: 'hidden', boxShadow: 'var(--shadow)',
    flexShrink: 0,
  },
  cover: { width: '100%', height: 'auto', display: 'block' },
  details: { flex: 1 },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
    fontWeight: 700, margin: '12px 0 8px',
  },
  author: { color: 'var(--text2)', fontSize: '1.05rem', marginBottom: 12 },
  meta: { display: 'flex', gap: 8, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' },
  metaItem: { color: 'var(--text3)', fontSize: '0.85rem' },
  description: { color: 'var(--text2)', lineHeight: 1.8, marginBottom: 28, fontSize: '0.95rem' },
  statsRow: { display: 'flex', gap: 16, marginBottom: 28 },
  statBox: {
    flex: 1, background: 'var(--bg2)', border: '1px solid var(--border)',
    borderRadius: 10, padding: '16px', textAlign: 'center',
  },
  statValue: { display: 'block', fontSize: '1.6rem', fontWeight: 700, marginBottom: 4 },
  statLabel: { color: 'var(--text3)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 1 },
  rentalBox: {
    background: 'var(--bg2)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', padding: 24,
  },
  daysRow: { display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' },
  dayBtns: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  dayBtn: {
    padding: '7px 14px', borderRadius: 8, cursor: 'pointer',
    background: 'var(--bg3)', border: '1px solid var(--border)',
    color: 'var(--text2)', fontSize: '0.85rem',
  },
  dayBtnActive: {
    background: 'rgba(232,197,71,0.15)',
    border: '1px solid rgba(232,197,71,0.4)',
    color: 'var(--accent)', fontWeight: 600,
  },
  costRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 20, padding: '12px 0', borderTop: '1px solid var(--border)',
  },
  rentBtn: {
    width: '100%', padding: '13px',
    background: 'var(--accent)', color: 'var(--bg)',
    borderRadius: 10, fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
    transition: 'all 0.2s',
  },
  unavailableBox: {
    background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
    borderRadius: 'var(--radius)', padding: 24, textAlign: 'center',
  },
};
