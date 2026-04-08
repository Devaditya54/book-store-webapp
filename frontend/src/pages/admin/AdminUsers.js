import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [userRentals, setUserRentals] = useState([]);
  const [loadingRentals, setLoadingRentals] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get('https://book-store-webapp-kappa.vercel.app/api/admin/users')
      .then(r => setUsers(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const viewRentals = async (user) => {
    setSelected(user);
    setLoadingRentals(true);
    try {
      const { data } = await axios.get(`https://book-store-webapp-kappa.vercel.app/api/admin/rentals/user/${user._id}`);
      setUserRentals(data);
    } catch { setUserRentals([]); }
    finally { setLoadingRentals(false); }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-enter">
      <h2 style={styles.title}>Users</h2>
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search users..."
        style={styles.searchInput}
      />

      {loading ? <div className="spinner" /> : (
        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: 20 }}>
          {/* Users table */}
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  {['User', 'Email', 'Joined', 'Actions'].map(h => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(user => (
                  <tr key={user._id} style={{ ...styles.tr, background: selected?._id === user._id ? 'rgba(232,197,71,0.05)' : '' }}>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={styles.avatar}>{user.name[0].toUpperCase()}</div>
                        <span style={{ fontWeight: 600 }}>{user.name}</span>
                      </div>
                    </td>
                    <td style={{ ...styles.td, color: 'var(--text2)' }}>{user.email}</td>
                    <td style={{ ...styles.td, color: 'var(--text3)', fontSize: '0.82rem' }}>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td style={styles.td}>
                      <button onClick={() => viewRentals(user)} style={styles.viewBtn}>
                        View Rentals
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* User rentals */}
          {selected && (
            <div style={styles.rentalPanel}>
              <div style={styles.rentalPanelHeader}>
                <h3 style={{ fontFamily: "'Playfair Display', serif" }}>
                  {selected.name}'s Rentals
                </h3>
                <button onClick={() => setSelected(null)} style={styles.closeBtn}>✕</button>
              </div>
              {loadingRentals ? <div className="spinner" /> : userRentals.length === 0 ? (
                <p style={{ color: 'var(--text3)', padding: 24, textAlign: 'center' }}>No rentals found</p>
              ) : (
                <div style={styles.rentalList}>
                  {userRentals.map(r => (
                    <div key={r._id} style={styles.rentalItem}>
                      <img
                        src={r.book?.coverImage || 'https://via.placeholder.com/48x68/232136/e8c547?text=📖'}
                        alt="" style={styles.thumb}
                        onError={e => { e.target.src = 'https://via.placeholder.com/48x68/232136/e8c547?text=📖'; }}
                      />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 2 }}>{r.book?.title}</p>
                        <p style={{ color: 'var(--text3)', fontSize: '0.78rem', marginBottom: 4 }}>{r.book?.genre}</p>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                          <span className={`badge badge-${r.status}`}>{r.status}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>
                            {new Date(r.rentedAt).toLocaleDateString()} → {new Date(r.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.9rem' }}>₹{r.rentPrice}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  title: { fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', marginBottom: 20 },
  searchInput: {
    width: '100%', maxWidth: 400, padding: '10px 16px', marginBottom: 20,
    background: 'var(--bg2)', border: '1px solid var(--border)',
    borderRadius: 10, color: 'var(--text)', fontSize: '0.9rem',
  },
  tableWrap: { background: 'var(--bg2)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    padding: '12px 16px', textAlign: 'left',
    fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 1,
    color: 'var(--text3)', borderBottom: '1px solid var(--border)',
    background: 'var(--bg3)',
  },
  tr: { borderBottom: '1px solid var(--border)' },
  td: { padding: '12px 16px', fontSize: '0.9rem', verticalAlign: 'middle' },
  avatar: {
    width: 34, height: 34, borderRadius: '50%',
    background: 'var(--surface2)', color: 'var(--accent)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 700, fontSize: '0.85rem',
  },
  viewBtn: {
    padding: '5px 14px', borderRadius: 6, cursor: 'pointer',
    background: 'rgba(124,92,255,0.12)', color: '#a78bfa',
    border: '1px solid rgba(124,92,255,0.25)', fontSize: '0.82rem',
  },
  rentalPanel: {
    background: 'var(--bg2)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', overflow: 'hidden',
  },
  rentalPanelHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '16px 20px', borderBottom: '1px solid var(--border)',
  },
  closeBtn: {
    background: 'none', border: 'none', color: 'var(--text2)',
    fontSize: '1.1rem', cursor: 'pointer',
  },
  rentalList: { display: 'flex', flexDirection: 'column' },
  rentalItem: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '12px 20px', borderBottom: '1px solid var(--border)',
  },
  thumb: { width: 48, height: 68, objectFit: 'cover', borderRadius: 6, flexShrink: 0 },
};
