import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminRentals() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get('https://book-store-webapp-kappa.vercel.app/api/admin/rentals')
      .then(r => setRentals(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = rentals.filter(r => {
    const matchFilter = filter === 'all' || r.status === filter;
    const term = search.toLowerCase();
    const matchSearch = !search ||
      r.user?.name?.toLowerCase().includes(term) ||
      r.user?.email?.toLowerCase().includes(term) ||
      r.book?.title?.toLowerCase().includes(term) ||
      r.book?.genre?.toLowerCase().includes(term);
    return matchFilter && matchSearch;
  });

  const counts = {
    all: rentals.length,
    active: rentals.filter(r => r.status === 'active').length,
    returned: rentals.filter(r => r.status === 'returned').length,
    overdue: rentals.filter(r => r.status === 'overdue').length,
  };

  return (
    <div className="page-enter">
      <h2 style={styles.title}>All Rentals</h2>

      {/* Filter tabs */}
      <div style={styles.tabs}>
        {Object.entries(counts).map(([key, count]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            style={{ ...styles.tab, ...(filter === key ? styles.tabActive : {}) }}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
            <span style={styles.tabBadge}>{count}</span>
          </button>
        ))}
      </div>

      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search by user, book, or genre..."
        style={styles.searchInput}
      />

      {loading ? <div className="spinner" /> : (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                {['Book', 'Genre', 'User', 'Rented On', 'Due Date', 'Returned', 'Price', 'Status'].map(h => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ ...styles.td, textAlign: 'center', padding: 40, color: 'var(--text3)' }}>
                    No rentals found
                  </td>
                </tr>
              ) : filtered.map(r => (
                <tr key={r._id} style={styles.tr}>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img
                        src={r.book?.coverImage || 'https://via.placeholder.com/36x50/232136/e8c547?text=📖'}
                        alt="" style={styles.thumb}
                        onError={e => { e.target.src = 'https://via.placeholder.com/36x50/232136/e8c547?text=📖'; }}
                      />
                      <span style={{ fontWeight: 600, fontSize: '0.88rem', maxWidth: 140, display: 'block' }}>
                        {r.book?.title || 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td style={styles.td}>
                    <span className="badge badge-genre">{r.book?.genre}</span>
                  </td>
                  <td style={styles.td}>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '0.88rem' }}>{r.user?.name}</p>
                      <p style={{ color: 'var(--text3)', fontSize: '0.75rem' }}>{r.user?.email}</p>
                    </div>
                  </td>
                  <td style={{ ...styles.td, color: 'var(--text2)', fontSize: '0.82rem' }}>
                    {new Date(r.rentedAt).toLocaleDateString()}
                  </td>
                  <td style={{ ...styles.td, fontSize: '0.82rem' }}>
                    {new Date(r.dueDate).toLocaleDateString()}
                  </td>
                  <td style={{ ...styles.td, color: 'var(--text3)', fontSize: '0.82rem' }}>
                    {r.returnedAt ? new Date(r.returnedAt).toLocaleDateString() : '—'}
                  </td>
                  <td style={{ ...styles.td, color: 'var(--accent)', fontWeight: 700 }}>₹{r.rentPrice}</td>
                  <td style={styles.td}>
                    <span className={`badge badge-${r.status}`}>{r.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles = {
  title: { fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', marginBottom: 20 },
  tabs: { display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' },
  tab: {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '8px 16px', borderRadius: 8, cursor: 'pointer',
    background: 'var(--bg2)', border: '1px solid var(--border)',
    color: 'var(--text2)', fontSize: '0.85rem',
  },
  tabActive: {
    background: 'rgba(232,197,71,0.12)',
    border: '1px solid rgba(232,197,71,0.3)', color: 'var(--accent)',
  },
  tabBadge: {
    background: 'var(--bg3)', borderRadius: 10,
    padding: '1px 7px', fontSize: '0.75rem', color: 'var(--text3)',
  },
  searchInput: {
    width: '100%', maxWidth: 450, padding: '10px 16px', marginBottom: 20,
    background: 'var(--bg2)', border: '1px solid var(--border)',
    borderRadius: 10, color: 'var(--text)', fontSize: '0.9rem',
  },
  tableWrap: {
    overflowX: 'auto', background: 'var(--bg2)',
    borderRadius: 'var(--radius)', border: '1px solid var(--border)',
  },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: 800 },
  th: {
    padding: '12px 14px', textAlign: 'left',
    fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: 1,
    color: 'var(--text3)', borderBottom: '1px solid var(--border)',
    background: 'var(--bg3)', whiteSpace: 'nowrap',
  },
  tr: { borderBottom: '1px solid var(--border)' },
  td: { padding: '12px 14px', verticalAlign: 'middle' },
  thumb: { width: 36, height: 50, objectFit: 'cover', borderRadius: 4, flexShrink: 0 },
};
