import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const GENRES = ['Fiction', 'Non-Fiction', 'Science', 'History', 'Biography', 'Technology', 'Fantasy', 'Mystery', 'Romance', 'Self-Help', 'Children', 'Other'];

const emptyForm = {
  title: '', author: '', description: '', genre: 'Fiction',
  rentPrice: '', totalCopies: 1, availableCopies: 1,
  isbn: '', publishedYear: '', language: 'English', rating: 4.0, coverImage: ''
};

export default function AdminBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const fetchBooks = () => {
    setLoading(true);
    axios.get('https://book-store-webapp-kappa.vercel.app/api/books?limit=100')
      .then(r => setBooks(r.data.books))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBooks(); }, []);

  const openAdd = () => { setForm(emptyForm); setEditId(null); setShowModal(true); };
  const openEdit = (book) => {
    setForm({ ...book, rentPrice: book.rentPrice.toString(), publishedYear: book.publishedYear?.toString() || '' });
    setEditId(book._id);
    setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditId(null); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, rentPrice: parseFloat(form.rentPrice), totalCopies: parseInt(form.totalCopies), availableCopies: parseInt(form.availableCopies) };
      if (editId) {
        const { data } = await axios.put(`https://book-store-webapp-kappa.vercel.app/api/books/${editId}`, payload);
        setBooks(prev => prev.map(b => b._id === editId ? data : b));
        toast.success('Book updated!');
      } else {
        const { data } = await axios.post('https://book-store-webapp-kappa.vercel.app/api/books', payload);
        setBooks(prev => [data, ...prev]);
        toast.success('Book added!');
      }
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this book?')) return;
    try {
      await axios.delete(`https://book-store-webapp-kappa.vercel.app/api/books/${id}`);
      setBooks(prev => prev.filter(b => b._id !== id));
      toast.success('Book removed');
    } catch { toast.error('Delete failed'); }
  };

  const filtered = books.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-enter">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <h2 style={styles.title}>Manage Books</h2>
        <button onClick={openAdd} style={styles.addBtn}>+ Add New Book</button>
      </div>

      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search books..."
        style={styles.searchInput}
      />

      {loading ? <div className="spinner" /> : (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                {['Cover', 'Title', 'Author', 'Genre', 'Price', 'Copies', 'Available', 'Actions'].map(h => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(book => (
                <tr key={book._id} style={styles.tr}>
                  <td style={styles.td}>
                    <img src={book.coverImage || 'https://via.placeholder.com/40x56/232136/e8c547?text=📖'}
                      alt="" style={styles.coverThumb}
                      onError={e => { e.target.src = 'https://via.placeholder.com/40x56/232136/e8c547?text=📖'; }} />
                  </td>
                  <td style={styles.td}>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{book.title}</span>
                  </td>
                  <td style={{ ...styles.td, color: 'var(--text2)' }}>{book.author}</td>
                  <td style={styles.td}><span className="badge badge-genre">{book.genre}</span></td>
                  <td style={{ ...styles.td, color: 'var(--accent)', fontWeight: 700 }}>₹{book.rentPrice}</td>
                  <td style={styles.td}>{book.totalCopies}</td>
                  <td style={styles.td}>
                    <span style={{ color: book.availableCopies > 0 ? '#4ade80' : '#f87171', fontWeight: 600 }}>
                      {book.availableCopies}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => openEdit(book)} style={styles.editBtn}>Edit</button>
                      <button onClick={() => handleDelete(book._id)} style={styles.deleteBtn}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem' }}>
                {editId ? 'Edit Book' : 'Add New Book'}
              </h3>
              <button onClick={closeModal} style={styles.closeBtn}>✕</button>
            </div>
            <form onSubmit={handleSave} style={styles.modalForm}>
              <div style={styles.formGrid}>
                <Field label="Title" value={form.title} onChange={v => setForm({ ...form, title: v })} required />
                <Field label="Author" value={form.author} onChange={v => setForm({ ...form, author: v })} required />
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={styles.label}>Description</label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    style={{ ...styles.input, height: 80, resize: 'vertical' }}
                    required
                  />
                </div>
                <div>
                  <label style={styles.label}>Genre</label>
                  <select value={form.genre} onChange={e => setForm({ ...form, genre: e.target.value })} style={styles.input}>
                    {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <Field label="Rent Price (₹/day)" type="number" step="0.01" value={form.rentPrice} onChange={v => setForm({ ...form, rentPrice: v })} required />
                <Field label="Total Copies" type="number" value={form.totalCopies} onChange={v => setForm({ ...form, totalCopies: v })} required />
                <Field label="Available Copies" type="number" value={form.availableCopies} onChange={v => setForm({ ...form, availableCopies: v })} required />
                <Field label="Published Year" type="number" value={form.publishedYear} onChange={v => setForm({ ...form, publishedYear: v })} />
                <Field label="ISBN" value={form.isbn} onChange={v => setForm({ ...form, isbn: v })} />
                <Field label="Language" value={form.language} onChange={v => setForm({ ...form, language: v })} />
                <Field label="Rating (0-5)" type="number" step="0.1" min="0" max="5" value={form.rating} onChange={v => setForm({ ...form, rating: v })} />
                <div style={{ gridColumn: '1 / -1' }}>
                  <Field label="Cover Image URL" value={form.coverImage} onChange={v => setForm({ ...form, coverImage: v })} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
                <button type="button" onClick={closeModal} style={styles.cancelBtn}>Cancel</button>
                <button type="submit" disabled={saving} style={styles.saveBtn}>
                  {saving ? 'Saving...' : editId ? 'Update Book' : 'Add Book'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', required, step, min, max }) {
  return (
    <div>
      <label style={{ fontSize: '0.8rem', color: 'var(--text2)', fontWeight: 600, display: 'block', marginBottom: 4 }}>{label}</label>
      <input
        type={type} value={value}
        onChange={e => onChange(e.target.value)}
        style={{ width: '100%', padding: '9px 12px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: '0.9rem' }}
        required={required} step={step} min={min} max={max}
      />
    </div>
  );
}

const styles = {
  title: { fontFamily: "'Playfair Display', serif", fontSize: '1.8rem' },
  addBtn: {
    padding: '10px 22px', background: 'var(--accent)', color: 'var(--bg)',
    borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem',
  },
  searchInput: {
    width: '100%', maxWidth: 400, padding: '10px 16px', marginBottom: 20,
    background: 'var(--bg2)', border: '1px solid var(--border)',
    borderRadius: 10, color: 'var(--text)', fontSize: '0.9rem',
  },
  tableWrap: { overflowX: 'auto', background: 'var(--bg2)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    padding: '12px 16px', textAlign: 'left',
    fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 1,
    color: 'var(--text3)', borderBottom: '1px solid var(--border)',
    background: 'var(--bg3)',
  },
  tr: { borderBottom: '1px solid var(--border)', transition: 'background 0.15s' },
  td: { padding: '12px 16px', fontSize: '0.88rem', verticalAlign: 'middle' },
  coverThumb: { width: 40, height: 56, objectFit: 'cover', borderRadius: 4 },
  editBtn: {
    padding: '5px 12px', borderRadius: 6, cursor: 'pointer',
    background: 'rgba(232,197,71,0.12)', color: 'var(--accent)',
    border: '1px solid rgba(232,197,71,0.3)', fontSize: '0.8rem',
  },
  deleteBtn: {
    padding: '5px 12px', borderRadius: 6, cursor: 'pointer',
    background: 'rgba(239,68,68,0.1)', color: '#f87171',
    border: '1px solid rgba(239,68,68,0.2)', fontSize: '0.8rem',
  },
  modalOverlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
    zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 16, overflowY: 'auto',
  },
  modal: {
    background: 'var(--bg2)', border: '1px solid var(--border)',
    borderRadius: 16, width: '100%', maxWidth: 700,
    maxHeight: '90vh', overflowY: 'auto',
  },
  modalHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '20px 24px', borderBottom: '1px solid var(--border)',
  },
  closeBtn: {
    background: 'none', border: 'none', color: 'var(--text2)',
    fontSize: '1.2rem', cursor: 'pointer',
  },
  modalForm: { padding: 24 },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 },
  label: { fontSize: '0.8rem', color: 'var(--text2)', fontWeight: 600, display: 'block', marginBottom: 4 },
  input: {
    width: '100%', padding: '9px 12px',
    background: 'var(--bg3)', border: '1px solid var(--border)',
    borderRadius: 8, color: 'var(--text)', fontSize: '0.9rem',
  },
  cancelBtn: {
    padding: '10px 22px', background: 'var(--bg3)', border: '1px solid var(--border)',
    borderRadius: 8, color: 'var(--text2)', cursor: 'pointer',
  },
  saveBtn: {
    padding: '10px 28px', background: 'var(--accent)', color: 'var(--bg)',
    borderRadius: 8, fontWeight: 700, cursor: 'pointer',
  },
};
