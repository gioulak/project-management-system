import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Layout/Navbar';
import { adminService } from '../services/api';

const Admin = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, inactive

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/dashboard');
      return;
    }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllUsers();
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching users:', err);
      setLoading(false);
    }
  };

  const handleActivate = async (userId) => {
    try {
      await adminService.activateUser(userId);
      setSuccess('User activated successfully!');
      fetchUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to activate user');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDeactivate = async (userId) => {
    if (!window.confirm('Are you sure you want to deactivate this user?')) return;
    try {
      await adminService.deactivateUser(userId);
      setSuccess('User deactivated successfully!');
      fetchUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to deactivate user');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleRoleChange = async (userId, role) => {
    try {
      await adminService.updateUserRole(userId, role);
      setSuccess('Role updated successfully!');
      fetchUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update role');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to permanently delete this user?')) return;
    try {
      await adminService.deleteUser(userId);
      setSuccess('User deleted successfully!');
      fetchUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete user');
      setTimeout(() => setError(''), 3000);
    }
  };

  const filteredUsers = users.filter((u) => {
    if (filter === 'active') return u.is_active;
    if (filter === 'inactive') return !u.is_active;
    return true;
  });

  const pendingCount = users.filter((u) => !u.is_active).length;
  const activeCount = users.filter((u) => u.is_active).length;

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'ADMIN': return '#9b59b6';
      case 'TEAM_LEADER': return '#3498db';
      case 'MEMBER': return '#27ae60';
      default: return '#95a5a6';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={styles.loading}>Loading admin panel...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Admin Panel</h1>
            <p style={styles.subtitle}>Manage users and permissions</p>
          </div>
        </div>

        {success && <div style={styles.success}>{success}</div>}
        {error && <div style={styles.error}>{error}</div>}

        {/* Summary cards */}
        <div style={styles.summary}>
          <div style={{ ...styles.summaryCard, borderLeft: '4px solid #3498db' }}>
            <div style={styles.summaryNumber}>{users.length}</div>
            <div style={styles.summaryLabel}>Total Users</div>
          </div>
          <div style={{ ...styles.summaryCard, borderLeft: '4px solid #27ae60' }}>
            <div style={styles.summaryNumber}>{activeCount}</div>
            <div style={styles.summaryLabel}>Active</div>
          </div>
          <div style={{ ...styles.summaryCard, borderLeft: '4px solid #e74c3c' }}>
            <div style={styles.summaryNumber}>{pendingCount}</div>
            <div style={styles.summaryLabel}>Pending Approval</div>
          </div>
        </div>

        {/* Filter tabs */}
        <div style={styles.tabs}>
          {['all', 'active', 'inactive'].map((tab) => (
            <button
              key={tab}
              style={{
                ...styles.tab,
                ...(filter === tab ? styles.activeTab : {}),
              }}
              onClick={() => setFilter(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'inactive' && pendingCount > 0 && (
                <span style={styles.badge}>{pendingCount}</span>
              )}
            </button>
          ))}
        </div>

        {/* Users table */}
        {filteredUsers.length === 0 ? (
          <div style={styles.emptyState}>
            <p>No users found.</p>
          </div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>User</th>
                  <th style={styles.th}>Username</th>
                  <th style={styles.th}>Role</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Joined</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id} style={styles.tableRow}>
                    <td style={styles.td}>
                      <div style={styles.userInfo}>
                        <div style={styles.avatar}>
                          {u.first_name[0]}{u.last_name[0]}
                        </div>
                        <div>
                          <div style={styles.userName}>{u.first_name} {u.last_name}</div>
                          <div style={styles.userEmail}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.username}>@{u.username}</span>
                    </td>
                    <td style={styles.td}>
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        style={{
                          ...styles.roleSelect,
                          backgroundColor: getRoleBadgeColor(u.role),
                        }}
                      >
                        <option value="MEMBER">MEMBER</option>
                        <option value="TEAM_LEADER">TEAM_LEADER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.statusBadge,
                        backgroundColor: u.is_active ? '#d4edda' : '#f8d7da',
                        color: u.is_active ? '#155724' : '#721c24',
                      }}>
                        {u.is_active ? '✓ Active' : '⏳ Pending'}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.date}>{formatDate(u.created_at)}</span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actions}>
                        {!u.is_active ? (
                          <button
                            style={styles.activateBtn}
                            onClick={() => handleActivate(u.id)}
                          >
                            Activate
                          </button>
                        ) : (
                          <button
                            style={styles.deactivateBtn}
                            onClick={() => handleDeactivate(u.id)}
                          >
                            Deactivate
                          </button>
                        )}
                        <button
                          style={styles.deleteBtn}
                          onClick={() => handleDelete(u.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

const styles = {
  container: { maxWidth: '1200px', margin: '0 auto', padding: '2rem' },
  loading: { textAlign: 'center', padding: '3rem', fontSize: '1.2rem', color: '#7f8c8d' },
  header: { marginBottom: '2rem' },
  title: { fontSize: '2rem', color: '#2c3e50', marginBottom: '0.25rem' },
  subtitle: { fontSize: '1rem', color: '#7f8c8d' },
  success: { backgroundColor: '#d4edda', color: '#155724', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #c3e6cb' },
  error: { backgroundColor: '#f8d7da', color: '#721c24', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #f5c6cb' },
  summary: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' },
  summaryCard: { backgroundColor: 'white', padding: '1.25rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  summaryNumber: { fontSize: '2rem', fontWeight: 'bold', color: '#2c3e50' },
  summaryLabel: { fontSize: '0.9rem', color: '#7f8c8d', marginTop: '0.25rem' },
  tabs: { display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' },
  tab: { padding: '0.5rem 1.25rem', border: '2px solid #e0e0e0', borderRadius: '8px', backgroundColor: 'white', cursor: 'pointer', fontSize: '0.95rem', color: '#7f8c8d', display: 'flex', alignItems: 'center', gap: '0.5rem' },
  activeTab: { backgroundColor: '#3498db', color: 'white', borderColor: '#3498db' },
  badge: { backgroundColor: '#e74c3c', color: 'white', borderRadius: '12px', padding: '0.1rem 0.5rem', fontSize: '0.75rem', fontWeight: 'bold' },
  emptyState: { textAlign: 'center', padding: '3rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', color: '#7f8c8d' },
  tableWrapper: { backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHeader: { backgroundColor: '#f8f9fa' },
  th: { padding: '1rem 1.25rem', textAlign: 'left', fontSize: '0.85rem', fontWeight: '600', color: '#7f8c8d', textTransform: 'uppercase', letterSpacing: '0.05em' },
  tableRow: { borderTop: '1px solid #ecf0f1' },
  td: { padding: '1rem 1.25rem', verticalAlign: 'middle' },
  userInfo: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  avatar: { width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#3498db', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 'bold', flexShrink: 0 },
  userName: { fontSize: '0.95rem', fontWeight: '600', color: '#2c3e50' },
  userEmail: { fontSize: '0.8rem', color: '#7f8c8d' },
  username: { fontSize: '0.9rem', color: '#7f8c8d', fontFamily: 'monospace' },
  roleSelect: { padding: '0.35rem 0.75rem', border: 'none', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold', color: 'white', cursor: 'pointer' },
  statusBadge: { padding: '0.35rem 0.75rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '600' },
  date: { fontSize: '0.85rem', color: '#7f8c8d' },
  actions: { display: 'flex', gap: '0.5rem' },
  activateBtn: { padding: '0.4rem 0.875rem', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' },
  deactivateBtn: { padding: '0.4rem 0.875rem', backgroundColor: '#f39c12', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' },
  deleteBtn: { padding: '0.4rem 0.875rem', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' },
};

export default Admin;