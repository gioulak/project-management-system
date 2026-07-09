import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Layout/Navbar';
import { taskService, teamService } from '../services/api';

const Tasks = () => {
  const { user, isAdmin, isTeamLeader } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [tasks, setTasks] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [teamFilter, setTeamFilter] = useState(searchParams.get('teamId') || '');

  // Create task modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    teamId: '',
    assignedTo: '',
    priority: 'MEDIUM',
    dueDate: '',
  });

  useEffect(() => {
    fetchTasks();
    fetchTeams();
  }, [statusFilter, teamFilter]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (teamFilter) params.teamId = teamFilter;

      const response = await taskService.getAllTasks(params);
      setTasks(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setLoading(false);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await teamService.getAllTeams();
      setTeams(response.data);
    } catch (err) {
      console.error('Error fetching teams:', err);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await taskService.createTask({
        ...newTask,
        assignedTo: parseInt(newTask.assignedTo),
      });
      setSuccess('Task created successfully!');
      setShowCreateModal(false);
      setNewTask({ title: '', description: '', teamId: '', assignedTo: '', priority: 'MEDIUM', dueDate: '' });
      fetchTasks();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create task');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskService.updateTaskStatus(taskId, newStatus);
      setSuccess('Status updated!');
      fetchTasks();
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update status');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await taskService.deleteTask(taskId);
      setSuccess('Task deleted!');
      fetchTasks();
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete task');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'TODO': return '#95a5a6';
      case 'IN_PROGRESS': return '#3498db';
      case 'DONE': return '#27ae60';
      default: return '#95a5a6';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH': return '#e74c3c';
      case 'MEDIUM': return '#f39c12';
      case 'LOW': return '#95a5a6';
      default: return '#95a5a6';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={styles.loading}>Loading tasks...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Tasks</h1>
            <p style={styles.subtitle}>{tasks.length} task{tasks.length !== 1 ? 's' : ''} found</p>
          </div>
          {(isAdmin() || isTeamLeader()) && (
            <button style={styles.createBtn} onClick={() => setShowCreateModal(true)}>
              + Create Task
            </button>
          )}
        </div>

        {success && <div style={styles.success}>{success}</div>}
        {error && <div style={styles.error}>{error}</div>}

        {/* Filters */}
        <div style={styles.filters}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="">All Statuses</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>

          <select
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="">All Teams</option>
            {teams.map((team) => (
              <option key={team._id} value={team._id}>{team.name}</option>
            ))}
          </select>

          {(statusFilter || teamFilter) && (
            <button
              style={styles.clearBtn}
              onClick={() => { setStatusFilter(''); setTeamFilter(''); }}
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Tasks List */}
        {tasks.length === 0 ? (
          <div style={styles.emptyState}>
            <h2>No tasks found</h2>
            <p>Try adjusting your filters or create a new task.</p>
          </div>
        ) : (
          <div style={styles.tasksList}>
            {tasks.map((task) => (
              <div key={task._id} style={styles.taskCard}>
                <div style={styles.taskHeader}>
                  <div style={styles.taskTitleRow}>
                    <h3 style={styles.taskTitle}>{task.title}</h3>
                    <div style={styles.badges}>
                      <span style={{ ...styles.badge, backgroundColor: getPriorityColor(task.priority) }}>
                        {task.priority}
                      </span>
                      <span style={{ ...styles.badge, backgroundColor: getStatusColor(task.status) }}>
                        {task.status.replace('_', ' ')}
                      </span>
                      {isOverdue(task.dueDate) && task.status !== 'DONE' && (
                        <span style={{ ...styles.badge, backgroundColor: '#e74c3c' }}>OVERDUE</span>
                      )}
                    </div>
                  </div>
                </div>

                <p style={styles.taskDescription}>{task.description}</p>

                <div style={styles.taskMeta}>
                  <span>📅 Due: {formatDate(task.dueDate)}</span>
                  <span>💬 {task.comments?.length || 0} comments</span>
                  <span>👤 Assigned to: User {task.assignedTo}</span>
                </div>

                <div style={styles.taskActions}>
                  {/* Status update */}
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task._id, e.target.value)}
                    style={styles.statusSelect}
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                  </select>

                  {(isAdmin() || isTeamLeader()) && (
                    <button
                      style={styles.deleteBtn}
                      onClick={() => handleDeleteTask(task._id)}
                    >
                      🗑️ Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Task Modal */}
        {showCreateModal && (
          <div style={styles.modalOverlay} onClick={() => setShowCreateModal(false)}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <h2 style={styles.modalTitle}>Create New Task</h2>
              <form onSubmit={handleCreateTask} style={styles.form}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Title</label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    style={styles.input}
                    placeholder="Task title"
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Description</label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    style={{ ...styles.input, minHeight: '80px', resize: 'vertical' }}
                    placeholder="Task description"
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Team</label>
                  <select
                    value={newTask.teamId}
                    onChange={(e) => setNewTask({ ...newTask, teamId: e.target.value })}
                    style={styles.input}
                    required
                  >
                    <option value="">Select a team</option>
                    {teams.map((team) => (
                      <option key={team._id} value={team._id}>{team.name}</option>
                    ))}
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Assign To (User ID)</label>
                  <input
                    type="number"
                    value={newTask.assignedTo}
                    onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                    style={styles.input}
                    placeholder="User ID"
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    style={styles.input}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Due Date</label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    style={styles.input}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div style={styles.modalButtons}>
                  <button type="button" style={styles.cancelBtn} onClick={() => setShowCreateModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" style={styles.submitBtn}>
                    Create Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const styles = {
  container: { maxWidth: '1200px', margin: '0 auto', padding: '2rem' },
  loading: { textAlign: 'center', padding: '3rem', fontSize: '1.2rem', color: '#7f8c8d' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' },
  title: { fontSize: '2rem', color: '#2c3e50', marginBottom: '0.25rem' },
  subtitle: { fontSize: '1rem', color: '#7f8c8d' },
  createBtn: { padding: '0.75rem 1.5rem', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' },
  success: { backgroundColor: '#d4edda', color: '#155724', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #c3e6cb' },
  error: { backgroundColor: '#f8d7da', color: '#721c24', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #f5c6cb' },
  filters: { display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' },
  filterSelect: { padding: '0.5rem 1rem', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '0.95rem', backgroundColor: 'white', cursor: 'pointer' },
  clearBtn: { padding: '0.5rem 1rem', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  emptyState: { textAlign: 'center', padding: '4rem 2rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  tasksList: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  taskCard: { backgroundColor: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  taskHeader: { marginBottom: '0.75rem' },
  taskTitleRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '1rem' },
  taskTitle: { fontSize: '1.2rem', color: '#2c3e50', margin: 0 },
  badges: { display: 'flex', gap: '0.5rem', flexShrink: 0 },
  badge: { padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.75rem', color: 'white', fontWeight: 'bold', whiteSpace: 'nowrap' },
  taskDescription: { color: '#7f8c8d', fontSize: '0.95rem', margin: '0.5rem 0 1rem' },
  taskMeta: { display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: '#95a5a6', marginBottom: '1rem', flexWrap: 'wrap' },
  taskActions: { display: 'flex', gap: '1rem', alignItems: 'center' },
  statusSelect: { padding: '0.5rem 1rem', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '0.9rem', cursor: 'pointer' },
  deleteBtn: { padding: '0.5rem 1rem', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modal: { backgroundColor: 'white', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' },
  modalTitle: { fontSize: '1.5rem', color: '#2c3e50', marginBottom: '1.5rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
  formGroup: { display: 'flex', flexDirection: 'column' },
  label: { marginBottom: '0.5rem', fontWeight: '600', color: '#2c3e50', fontSize: '0.95rem' },
  input: { padding: '0.75rem', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '1rem', outline: 'none' },
  modalButtons: { display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' },
  cancelBtn: { padding: '0.75rem 1.5rem', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  submitBtn: { padding: '0.75rem 1.5rem', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
};

export default Tasks;