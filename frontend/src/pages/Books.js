import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import BookCard from '../components/BookCard';

const GENRES = ['All', 'Fiction', 'Non-Fiction', 'Science', 'History', 'Biography', 'Technology', 'Fantasy', 'Mystery', 'Romance', 'Self-Help', 'Children', 'Other'];

export default function Books() {
  const [books, setBooks] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const genre = searchParams.get('genre') || 'All';
  const search = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const [searchInput, setSearchInput] = useState(search);

  const fetchBooks = useCallback(() => {
    setLoading(true);
    const params = { page, limit: 12 };
    if (genre && genre !== 'All') params.genre = genre;
    if (search) params.search = search;
    axios.get('/api/books', { params })
      .then(r => { setBooks(r.data.books); setTotal(r.data.total); setPages(r.data.pages); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [genre, search, page]);

  useEffect(() => { fetchBooks(); }, [fetchBooks]);

  const setGenre = (g) => setSearchParams({ genre: g, page: 1 });
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ genre, search: searchInput, page: 1 });
  };

  return (
    <div style={styles.page} className="page-enter">
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Browse Books</h1>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>{total} books found</p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <input
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder="Search by title or author..."
            style={styles.searchInput}
          />
          <button type="submit" style={styles.searchBtn}>Search</button>
        </form>

        {/* Genre filter */}
        <div style={styles.genreRow}>
          {GENRES.map(g => (
            <button
              key={g}
              onClick={() => setGenre(g)}
              style={{ ...styles.genreBtn, ...(genre === g ? styles.genreBtnActive : {}) }}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Books grid */}
        {loading ? (
          <div className="spinner" />
        ) : books.length === 0 ? (
          <div style={styles.empty}>
            <div style={{ fontSize: '4rem', marginBottom: 16 }}>📭</div>
            <h3>No books found</h3>
            <p style={{ color: 'var(--text2)' }}>Try a different genre or search term</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {books.map(book => <BookCard key={book._id} book={book} />)}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div style={styles.pagination}>
            {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setSearchParams({ genre, search, page: p })}
                style={{ ...styles.pageBtn, ...(page === p ? styles.pageBtnActive : {}) }}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', padding: '40px 0' },
  container: { maxWidth: 1200, margin: '0 auto', padding: '0 24px' },
  header: { marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' },
  searchForm: { display: 'flex', gap: 10, marginBottom: 20 },
  searchInput: {
    flex: 1, padding: '11px 18px',
    background: 'var(--bg2)', border: '1px solid var(--border)',
    borderRadius: 10, color: 'var(--text)', fontSize: '0.95rem',
  },
  searchBtn: {
    padding: '11px 24px',
    background: 'var(--accent)', color: 'var(--bg)',
    borderRadius: 10, fontWeight: 600, fontSize: '0.9rem',
  },
  genreRow: {
    display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32,
  },
  genreBtn: {
    padding: '7px 16px', borderRadius: 20,
    background: 'var(--bg2)', border: '1px solid var(--border)',
    color: 'var(--text2)', fontSize: '0.85rem', cursor: 'pointer',
    transition: 'all 0.2s',
  },
  genreBtnActive: {
    background: 'rgba(232,197,71,0.15)',
    border: '1px solid rgba(232,197,71,0.4)',
    color: 'var(--accent)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
    gap: 20,
  },
  empty: {
    textAlign: 'center', padding: '80px 24px',
    background: 'var(--bg2)', borderRadius: 'var(--radius)',
    border: '1px solid var(--border)',
  },
  pagination: { display: 'flex', gap: 8, justifyContent: 'center', marginTop: 40 },
  pageBtn: {
    width: 36, height: 36, borderRadius: 8,
    background: 'var(--bg2)', border: '1px solid var(--border)',
    color: 'var(--text)', cursor: 'pointer',
  },
  pageBtnActive: { background: 'var(--accent)', color: 'var(--bg)', border: 'none', fontWeight: 700 },
};
