import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function MyShelf() {
  const { user } = useAuth();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [returning, setReturning] = useState(null);

  useEffect(() => {
    axios.get('https://book-store-webapp-kappa.vercel.app/api/rentals/my')
      .then(r => setRentals(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleReturn = async (rentalId) => {
    setReturning(rentalId);
    try {
      await axios.put(`https://book-store-webapp-kappa.vercel.app/api/rentals/${rentalId}/return`);
      setRentals(prev => prev.map(r => r._id === rentalId ? { ...r, status: 'returned', returnedAt: new Date() } : r));
      toast.success('Book returned successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Return failed');
    } finally {
      setReturning(null);
    }
  };

  const filtered = filter === 'all' ? rentals : rentals.filter(r => r.status === filter);
  const active = rentals.filter(r => r.status === 'active').length;
  const returned = rentals.filter(r => r.status === 'returned').length;

  const daysLeft = (dueDate) => {
    const diff = Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div style={styles.page} className="page-enter">
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>My Shelf</h1>
            <p style={{ color: 'var(--text2)' }}>Welcome, {user?.name} 👋</p>
          </div>
          <Link to="/books" className="btn-primary">Browse More Books</Link>
        </div>

        {/* Stats */}
        <div style={styles.statsRow}>
          {[
            { label: 'Total Rentals', value: rentals.length, color: 'var(--text)' },
            { label: 'Currently Reading', value: active, color: '#4ade80' },
            { label: 'Returned', value: returned, color: 'var(--text3)' },
          ].map(s => (
            <div key={s.label} style={styles.statCard}>
              <span style={{ ...styles.statNum, color: s.color }}>{s.value}</span>
              <span style={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div style={styles.filterRow}>
          {['all', 'active', 'returned', 'overdue'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{ ...styles.filterBtn, ...(filter === f ? styles.filterBtnActive : {}) }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Rentals */}
        {loading ? <div className="spinner" /> : filtered.length === 0 ? (
          <div style={styles.empty}>
            <div style={{ fontSize: '4rem', marginBottom: 16 }}>📚</div>
            <h3 style={{ marginBottom: 8 }}>No books here yet</h3>
            <p style={{ color: 'var(--text2)', marginBottom: 24 }}>Start renting books to build your shelf!</p>
            <Link to="/books" className="btn-primary">Browse Books</Link>
          </div>
        ) : (
          <div style={styles.rentalList}>
            {filtered.map(rental => {
              const days = daysLeft(rental.dueDate);
              const isOverdue = days < 0 && rental.status === 'active';
              return (
                <div key={rental._id} style={styles.rentalCard}>
                  <img
                    src={rental.book?.coverImage || 'https://via.placeholder.com/80x110/232136/e8c547?text=📖'}
                    alt={rental.book?.title}
                    style={styles.bookCover}
                    onError={e => { e.target.src = 'https://via.placeholder.com/80x110/232136/e8c547?text=📖'; }}
                  />
                  <div style={styles.rentalInfo}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                      <div>
                        <h3 style={styles.bookTitle}>{rental.book?.title}</h3>
                        <p style={styles.bookAuthor}>{rental.book?.author}</p>
                        <span className="badge badge-genre">{rental.book?.genre}</span>
                      </div>
                      <span className={`badge badge-${isOverdue ? 'overdue' : rental.status}`}>
                        {isOverdue ? 'Overdue' : rental.status}
                      </span>
                    </div>
                    <div style={styles.rentalMeta}>
                      <div style={styles.metaItem}>
                        <span style={styles.metaLabel}>Rented On</span>
                        <span>{new Date(rental.rentedAt).toLocaleDateString()}</span>
                      </div>
                      <div style={styles.metaItem}>
                        <span style={styles.metaLabel}>Due Date</span>
                        <span style={{ color: isOverdue ? '#f87171' : 'inherit' }}>
                          {new Date(rental.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div style={styles.metaItem}>
                        <span style={styles.metaLabel}>Price Paid</span>
                        <span style={{ color: 'var(--accent)' }}>₹{rental.rentPrice}</span>
                      </div>
                      {rental.status === 'active' && (
                        <div style={styles.metaItem}>
                          <span style={styles.metaLabel}>Days Left</span>
                          <span style={{ color: days < 3 ? '#f87171' : '#4ade80', fontWeight: 600 }}>
                            {days < 0 ? `${Math.abs(days)} days overdue` : `${days} days`}
                          </span>
                        </div>
                      )}
                      {rental.returnedAt && (
                        <div style={styles.metaItem}>
                          <span style={styles.metaLabel}>Returned</span>
                          <span>{new Date(rental.returnedAt).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                    {rental.status === 'active' && (
                      <button
                        onClick={() => handleReturn(rental._id)}
                        disabled={returning === rental._id}
                        style={styles.returnBtn}
                      >
                        {returning === rental._id ? 'Returning...' : '↩ Return Book'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', padding: '40px 0' },
  container: { maxWidth: 900, margin: '0 auto', padding: '0 24px' },
  header: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 32,
  },
  title: { fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', marginBottom: 4 },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 28 },
  statCard: {
    background: 'var(--bg2)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', padding: '20px', textAlign: 'center',
  },
  statNum: { display: 'block', fontSize: '2rem', fontWeight: 700, fontFamily: "'Playfair Display', serif" },
  statLabel: { color: 'var(--text3)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: 1 },
  filterRow: { display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' },
  filterBtn: {
    padding: '7px 18px', borderRadius: 20, cursor: 'pointer',
    background: 'var(--bg2)', border: '1px solid var(--border)',
    color: 'var(--text2)', fontSize: '0.85rem',
  },
  filterBtnActive: {
    background: 'rgba(232,197,71,0.15)', border: '1px solid rgba(232,197,71,0.4)', color: 'var(--accent)',
  },
  empty: {
    textAlign: 'center', padding: '80px 24px',
    background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
  },
  rentalList: { display: 'flex', flexDirection: 'column', gap: 16 },
  rentalCard: {
    display: 'flex', gap: 20,
    background: 'var(--bg2)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', padding: 20, alignItems: 'flex-start',
  },
  bookCover: { width: 80, height: 110, objectFit: 'cover', borderRadius: 8, flexShrink: 0 },
  rentalInfo: { flex: 1 },
  bookTitle: { fontFamily: "'Playfair Display', serif", fontSize: '1.05rem', marginBottom: 4 },
  bookAuthor: { color: 'var(--text3)', fontSize: '0.85rem', marginBottom: 8 },
  rentalMeta: { display: 'flex', gap: 20, flexWrap: 'wrap', margin: '12px 0', },
  metaItem: { display: 'flex', flexDirection: 'column', gap: 2 },
  metaLabel: { fontSize: '0.72rem', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.5 },
  returnBtn: {
    padding: '8px 18px', borderRadius: 8, cursor: 'pointer',
    background: 'transparent', border: '1px solid var(--accent)',
    color: 'var(--accent)', fontSize: '0.85rem', fontWeight: 600,
  },
};
