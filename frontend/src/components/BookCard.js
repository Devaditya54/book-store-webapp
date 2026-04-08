import React from 'react';
import { Link } from 'react-router-dom';

export default function BookCard({ book }) {
  const stars = '★'.repeat(Math.round(book.rating)) + '☆'.repeat(5 - Math.round(book.rating));

  return (
    <Link to={`/books/${book._id}`} style={styles.card}>
      <div style={styles.imageWrap}>
        <img
          src={book.coverImage || `https://via.placeholder.com/200x280/232136/e8c547?text=${encodeURIComponent(book.title)}`}
          alt={book.title}
          style={styles.image}
          onError={(e) => { e.target.src = `https://via.placeholder.com/200x280/232136/e8c547?text=📖`; }}
        />
        <div style={styles.overlay}>
          <span style={styles.viewBtn}>View Details</span>
        </div>
        {book.availableCopies === 0 && (
          <div style={styles.unavailableBadge}>Unavailable</div>
        )}
      </div>
      <div style={styles.info}>
        <span className="badge badge-genre" style={{ marginBottom: 6 }}>{book.genre}</span>
        <h3 style={styles.title}>{book.title}</h3>
        <p style={styles.author}>by {book.author}</p>
        <div style={styles.footer}>
          <span style={styles.stars}>{stars}</span>
          <span style={styles.price}>₹{book.rentPrice}<span style={{ fontSize: '0.7rem', color: 'var(--text3)' }}>/day</span></span>
        </div>
        <p style={styles.copies}>
          {book.availableCopies > 0
            ? <span style={{ color: '#4ade80' }}>✓ {book.availableCopies} available</span>
            : <span style={{ color: '#f87171' }}>✗ Out of stock</span>
          }
        </p>
      </div>
    </Link>
  );
}

const styles = {
  card: {
    display: 'block',
    background: 'var(--bg2)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    overflow: 'hidden',
    transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
    cursor: 'pointer',
    textDecoration: 'none',
    ':hover': { transform: 'translateY(-4px)' },
  },
  imageWrap: {
    position: 'relative',
    paddingTop: '140%',
    overflow: 'hidden',
    background: 'var(--bg3)',
  },
  image: {
    position: 'absolute', top: 0, left: 0,
    width: '100%', height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s',
  },
  overlay: {
    position: 'absolute', inset: 0,
    background: 'rgba(15,14,23,0.7)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    opacity: 0, transition: 'opacity 0.2s',
    ':hover': { opacity: 1 },
  },
  viewBtn: {
    background: 'var(--accent)', color: 'var(--bg)',
    padding: '8px 20px', borderRadius: 8,
    fontWeight: 600, fontSize: '0.85rem',
  },
  unavailableBadge: {
    position: 'absolute', top: 10, right: 10,
    background: 'rgba(239,68,68,0.9)',
    color: '#fff', padding: '3px 8px',
    borderRadius: 6, fontSize: '0.7rem', fontWeight: 600,
  },
  info: { padding: '14px 16px' },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '0.95rem', fontWeight: 600,
    color: 'var(--text)', marginBottom: 4,
    display: '-webkit-box', WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical', overflow: 'hidden',
  },
  author: { fontSize: '0.8rem', color: 'var(--text3)', marginBottom: 8 },
  footer: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 6,
  },
  stars: { color: 'var(--accent)', fontSize: '0.75rem', letterSpacing: 1 },
  price: { color: 'var(--accent)', fontWeight: 700, fontSize: '1rem' },
  copies: { fontSize: '0.78rem' },
};
