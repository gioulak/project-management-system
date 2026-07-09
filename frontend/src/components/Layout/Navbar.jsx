import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout, isAdmin, isTeamLeader } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <h1 style={styles.logo} onClick={() => navigate('/dashboard')}>
          PMS
        </h1>

        <div style={styles.menu}>
          <button style={styles.link} onClick={() => navigate('/dashboard')}>
            Dashboard
          </button>
          <button style={styles.link} onClick={() => navigate('/teams')}>
            Teams
          </button>
          <button style={styles.link} onClick={() => navigate('/tasks')}>
            Tasks
          </button>
          <button style={styles.link} onClick={() => navigate('/my-tasks')}>
            My Tasks
          </button>
          {isAdmin() && (
            <button style={styles.link} onClick={() => navigate('/admin')}>
              Admin Panel
            </button>
          )}
        </div>

        <div style={styles.userSection}>
          <span style={styles.username}>
            {user?.first_name} {user?.last_name}
          </span>
          <span style={styles.role}>({user?.role})</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    backgroundColor: '#2c3e50',
    padding: '1rem 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    color: 'white',
    margin: 0,
    cursor: 'pointer',
    fontSize: '1.5rem',
  },
  menu: {
    display: 'flex',
    gap: '1rem',
  },
  link: {
    background: 'none',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    fontSize: '1rem',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    transition: 'background-color 0.3s',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    color: 'white',
  },
  username: {
    fontWeight: 'bold',
  },
  role: {
    fontSize: '0.9rem',
    opacity: 0.8,
  },
  logoutBtn: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
};

export default Navbar;
