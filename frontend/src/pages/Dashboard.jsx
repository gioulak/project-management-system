import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Layout/Navbar';
import { teamService, taskService } from '../services/api';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalTeams: 0,
    totalTasks: 0,
    todoTasks: 0,
    inProgressTasks: 0,
    doneTasks: 0,
    myTasks: 0,
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [teamResponse, taskResponse, myTasksResponse] = await Promise.all([
        teamService.getAllTeams(),
        taskService.getAllTasks(),
        taskService.getMyTasks(),
      ]);

      const teams = teamsResponse.data;
      const allTasks = tasksResponse.data;
      const myTasks = myTasksResponse.data;

      // Calculate statistics
      const todoTasks = allTasks.filter((t) => t.status === 'TODO').length;
      const inProgressTasks = allTasks.filter((t) => t.status === 'IN_PROGRESS').length;
      const doneTasks = allTasks.filter((t) => t.status === 'DONE').length;

      setStats({
        totalTeams: teams.length,
        totalTasks: allTasks.length,
        todoTasks,
        inProgressTasks,
        doneTasks,
        myTasks: myTasks.length,
      });

      // Get 5 most recent tasks
      setRecentTasks(myTasks.slice(0, 5));

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'TODO':
        return '#95a5a6';
      case 'IN_PROGRESS':
        return '#3498db';
      case 'DONE':
        return '#27ae60';
      default:
        return '#95a5a6';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH':
        return '#e74c3c';
      case 'MEDIUM':
        return '#f39c12';
      case 'LOW':
        return '#95a5a6';
      default:
        return '#95a5a6';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={styles.loading}>Loading dashboard...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Dashboard</h1>
          <p style={styles.welcome}>
            Welcome back, {user?.first_name}! Here's your project overview.
          </p>
        </div>

        {/* Statistics Cards */}
        <div style={styles.statsGrid}>
          <div style={{ ...styles.statCard, ...styles.statCardBlue }}>
            <div style={styles.statIcon}>📋</div>
            <div style={styles.statContent}>
              <div style={styles.statNumber}>{stats.totalTasks}</div>
              <div style={styles.statLabel}>Total Tasks</div>
            </div>
          </div>

          <div style={{ ...styles.statCard, ...styles.statCardGreen }}>
            <div style={styles.statIcon}>✅</div>
            <div style={styles.statContent}>
              <div style={styles.statNumber}>{stats.doneTasks}</div>
              <div style={styles.statLabel}>Completed</div>
            </div>
          </div>

          <div style={{ ...styles.statCard, ...styles.statCardOrange }}>
            <div style={styles.statIcon}>🔄</div>
            <div style={styles.statContent}>
              <div style={styles.statNumber}>{stats.inProgressTasks}</div>
              <div style={styles.statLabel}>In Progress</div>
            </div>
          </div>

          <div style={{ ...styles.statCard, ...styles.statCardPurple }}>
            <div style={styles.statIcon}>👥</div>
            <div style={styles.statContent}>
              <div style={styles.statNumber}>{stats.totalTeams}</div>
              <div style={styles.statLabel}>Teams</div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={styles.progressSection}>
          <h2 style={styles.sectionTitle}>Overall Progress</h2>
          <div style={styles.progressContainer}>
            <div style={styles.progressBar}>
              <div
                style={{
                  ...styles.progressSegment,
                  width: `${(stats.doneTasks / stats.totalTasks) * 100 || 0}%`,
                  backgroundColor: '#27ae60',
                }}
              ></div>
              <div
                style={{
                  ...styles.progressSegment,
                  width: `${(stats.inProgressTasks / stats.totalTasks) * 100 || 0}%`,
                  backgroundColor: '#3498db',
                }}
              ></div>
              <div
                style={{
                  ...styles.progressSegment,
                  width: `${(stats.todoTasks / stats.totalTasks) * 100 || 0}%`,
                  backgroundColor: '#95a5a6',
                }}
              ></div>
            </div>
            <div style={styles.progressLegend}>
              <div style={styles.legendItem}>
                <span style={{ ...styles.legendDot, backgroundColor: '#27ae60' }}></span>
                <span>Done ({stats.doneTasks})</span>
              </div>
              <div style={styles.legendItem}>
                <span style={{ ...styles.legendDot, backgroundColor: '#3498db' }}></span>
                <span>In Progress ({stats.inProgressTasks})</span>
              </div>
              <div style={styles.legendItem}>
                <span style={{ ...styles.legendDot, backgroundColor: '#95a5a6' }}></span>
                <span>To Do ({stats.todoTasks})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Tasks */}
        <div style={styles.recentSection}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>My Recent Tasks</h2>
            <button style={styles.viewAllBtn} onClick={() => navigate('/my-tasks')}>
              View All →
            </button>
          </div>

          {recentTasks.length === 0 ? (
            <div style={styles.emptyState}>
              <p>No tasks assigned to you yet.</p>
              <button style={styles.primaryBtn} onClick={() => navigate('/tasks')}>
                Browse Tasks
              </button>
            </div>
          ) : (
            <div style={styles.tasksList}>
              {recentTasks.map((task) => (
                <div
                  key={task._id}
                  style={styles.taskCard}
                  onClick={() => navigate(`/tasks/${task._id}`)}
                >
                  <div style={styles.taskHeader}>
                    <h3 style={styles.taskTitle}>{task.title}</h3>
                    <div style={styles.taskBadges}>
                      <span
                        style={{
                          ...styles.badge,
                          backgroundColor: getPriorityColor(task.priority),
                        }}
                      >
                        {task.priority}
                      </span>
                      <span
                        style={{
                          ...styles.badge,
                          backgroundColor: getStatusColor(task.status),
                        }}
                      >
                        {task.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <p style={styles.taskDescription}>{task.description}</p>
                  <div style={styles.taskFooter}>
                    <span style={styles.taskDate}>📅 Due: {formatDate(task.dueDate)}</span>
                    <span style={styles.taskComments}>💬 {task.comments?.length || 0} comments</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div style={styles.actionsSection}>
          <h2 style={styles.sectionTitle}>Quick Actions</h2>
          <div style={styles.actionsGrid}>
            <button style={styles.actionCard} onClick={() => navigate('/teams')}>
              <div style={styles.actionIcon}>👥</div>
              <div style={styles.actionText}>View Teams</div>
            </button>

            <button style={styles.actionCard} onClick={() => navigate('/tasks')}>
              <div style={styles.actionIcon}>📋</div>
              <div style={styles.actionText}>View All Tasks</div>
            </button>

            <button style={styles.actionCard} onClick={() => navigate('/my-tasks')}>
              <div style={styles.actionIcon}>✅</div>
              <div style={styles.actionText}>My Tasks</div>
            </button>

            {isAdmin() && (
              <button style={styles.actionCard} onClick={() => navigate('/admin')}>
                <div style={styles.actionIcon}>⚙️</div>
                <div style={styles.actionText}>Admin Panel</div>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const styles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '2rem',
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.2rem',
    color: '#7f8c8d',
  },
  header: {
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    color: '#2c3e50',
    marginBottom: '0.5rem',
  },
  welcome: {
    fontSize: '1.1rem',
    color: '#7f8c8d',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s',
    cursor: 'pointer',
  },
  statCardBlue: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
  },
  statCardGreen: {
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    color: 'white',
  },
  statCardOrange: {
    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    color: 'white',
  },
  statCardPurple: {
    background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    color: 'white',
  },
  statIcon: {
    fontSize: '3rem',
    marginRight: '1rem',
  },
  statContent: {
    flex: 1,
  },
  statNumber: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: '1rem',
    opacity: 0.9,
  },
  progressSection: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '2rem',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    color: '#2c3e50',
    marginBottom: '1rem',
  },
  progressContainer: {
    marginTop: '1rem',
  },
  progressBar: {
    display: 'flex',
    height: '30px',
    borderRadius: '15px',
    overflow: 'hidden',
    backgroundColor: '#ecf0f1',
  },
  progressSegment: {
    transition: 'width 0.3s ease',
  },
  progressLegend: {
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
    marginTop: '1rem',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  legendDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
  },
  recentSection: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '2rem',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  viewAllBtn: {
    backgroundColor: 'transparent',
    color: '#3498db',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem',
    color: '#7f8c8d',
  },
  primaryBtn: {
    marginTop: '1rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  tasksList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  taskCard: {
    padding: '1rem',
    border: '1px solid #ecf0f1',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  taskHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    marginBottom: '0.5rem',
  },
  taskTitle: {
    fontSize: '1.1rem',
    color: '#2c3e50',
    margin: 0,
  },
  taskBadges: {
    display: 'flex',
    gap: '0.5rem',
  },
  badge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.75rem',
    color: 'white',
    fontWeight: 'bold',
  },
  taskDescription: {
    color: '#7f8c8d',
    fontSize: '0.9rem',
    margin: '0.5rem 0',
  },
  taskFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
    color: '#95a5a6',
    marginTop: '0.5rem',
  },
  taskDate: {},
  taskComments: {},
  actionsSection: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '1rem',
  },
  actionCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2rem 1rem',
    backgroundColor: '#f8f9fa',
    border: '2px solid #ecf0f1',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  actionIcon: {
    fontSize: '3rem',
    marginBottom: '0.5rem',
  },
  actionText: {
    fontSize: '1rem',
    color: '#2c3e50',
    fontWeight: 'bold',
  },
};

export default Dashboard;
