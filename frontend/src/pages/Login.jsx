import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login({ username, password });

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.leftSection}>
        <div style={styles.brandSection}>
          <h1 style={styles.brandTitle}>Project Management System</h1>
          <p style={styles.brandSubtitle}>
            Manage your teams, tasks and projects
          </p>
          <div style={styles.features}>
  <div style={styles.feature}>
    <span style={styles.featureIcon}>✓</span>
    <span>Team Collaboration</span>
  </div>
  <div style={styles.feature}>
    <span style={styles.featureIcon}>✓</span>
    <span>Task Management</span>
  </div>
  <div style={styles.feature}>
    <span style={styles.featureIcon}>✓</span>
    <span>Progress Tracking</span>
  </div>
  <div style={styles.feature}>
    <span style={styles.featureIcon}>✓</span>
    <span>Real-time Updates</span>
  </div>
</div>
            
        </div>
      </div>

      <div style={styles.rightSection}>
        <div style={styles.formCard}>
          <h2 style={styles.formTitle}>Welcome Back</h2>
          <p style={styles.formSubtitle}>Login to your account</p>
        
          {error && <div style={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={styles.input}
		placeholder="Enter your username"
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                placeholder="Enter your password"
                required
              />
            </div>

            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p style={styles.signupLink}>
            Don't have an account?{' '}
            <Link to="/signup" style={styles.link}>
              Sign up
            </Link>
          </p>
       </div>
      </div>
     </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  leftSection: {
    flex: 1,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem',
    color: 'white',
  },
  brandSection: {
     maxWidth: '500px',
  },
  brandTitle: {
    fontSize: '3rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    lineHeight: '1.2',
  },
  brandSubtitle: {
    fontSize: '1.3rem',
    marginBottom: '3rem',
    opacity: 0.9,
    lineHeight: '1.5',
  },
  features: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  feature: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '1.1rem',
    gap: '1rem',
  },
  featureIcon: {
    fontSize: '1.5rem',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightSection: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem',
  },
  formCard: {
    backgroundColor: 'white',
    padding: '3rem',
    borderRadius: '12px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '500px',
  },
  formTitle: {
    fontSize: '2rem',
    color: '#2c3e50',
    marginBottom: '0.5rem',
    fontWeight: 'bold',
  },
  formSubtitle: {
    fontSize: '1.1rem',
    color: '#7f8c8d',
    marginBottom: '2rem',
  },
  error: {
    backgroundColor: '#fee',
    color: '#c33',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1.5rem',
    border: '1px solid #fcc',
    fontSize: '0.95rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '0.5rem',
    fontWeight: '600',
    color: '#2c3e50',
    fontSize: '1rem',
  },
  input: {
    padding: '1rem',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '1rem',
    transition: 'border-color 0.3s',
  },
  button: {
    padding: '1rem',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '1rem',
    transition: 'background-color 0.3s',
  },
  divider: {
    textAlign: 'center',
    margin: '2rem 0',
    position: 'relative',
  },
  dividerText: {
    backgroundColor: 'white',
    padding: '0 1 rem',
    color: '#7f8c8d',
    position: 'relative',
    zIndex: 1,
  },
  signupLink: {
    textAlign: 'center',
    marginTop: '1rem',
    color: '#7f8c8d',
  },
  link: {
    color: '#667eea',
    fontWeight: 'bold',
    textDecoration: 'none',
  },
};

export default Login;
