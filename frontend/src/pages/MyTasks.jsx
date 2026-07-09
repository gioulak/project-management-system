import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Layout/Navbar';
import { taskService } from '../services/api';

const MyTasks = () => {
  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchMyTasks();
  }, [statusFilter]);

  const fetchMyTasks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter) params.status = statusFilter;
      const response = await taskService.getMyTasks(params);
      setTasks(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskService.updateTaskStatus(taskId, newStatus);
      setSuccess('Status updated!');
      fetchMyTasks();
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update status');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleAddComment = async (taskId, text) => {
    if (!text.trim()) return;
    try {
      await taskService.addComment(taskId, text);
      setSuccess('Comment added!');
      fetchMyTasks();
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add comment');
      setTimeout(() => setError(''), 3000);
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
      month: 'short', day: 'numeric', year: 'numeric',
    });
  };

  const isOverdue = (dueDate) => new Date(dueDate) < new Date();

  const todoCount = tasks.filter((t) => t.status === 'TODO').length;
  const inProgressCount = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const doneCount = tasks.filter((t) => t.status === 'DONE').length;

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={styles.loading}>Loading your tasks...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>My Tasks</h1>
            <p style={styles.subtitle}>Welcome, {user?.first_name} — here are your assigned tasks</p>
          </div>
        </div>

        {success && <div style={styles.success}>{success}</div>}
        {error && <div style={styles.error}>{error}</div>}

        {/* Summary */}
        <div style={styles.summary}>
          <div style={{ ...styles.summaryCard, borderLeft: '4px solid #95a5a6' }}>
            <div style={styles.summaryNumber}>{todoCount}</div>
            <div style={styles.summaryLabel}>To Do</div>
          </div>
          <div style={{ ...styles.summaryCard, borderLeft: '4px solid #3498db' }}>
            <div style={styles.summaryNumber}>{inProgressCount}</div>
            <div style={styles.summaryLabel}>In Progress</div>
          </div>
          <div style={{ ...styles.summaryCard, borderLeft: '4px solid #27ae60' }}>
            <div style={styles.summaryNumber}>{doneCount}</div>
            <div style={styles.summaryLabel}>Done</div>
          </div>
        </div>

        {/* Filter */}
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
          {statusFilter && (
            <button style={styles.clearBtn} onClick={() => setStatusFilter('')}>
              Clear
            </button>
          )}
        </div>

        {tasks.length === 0 ? (
          <div style={styles.emptyState}>
            <h2>No tasks found</h2>
            <p>You have no tasks assigned to you yet.</p>
          </div>
        ) : (
          <div style={styles.tasksList}>
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onStatusChange={handleStatusChange}
                onAddComment={handleAddComment}
                getStatusColor={getStatusColor}
                getPriorityColor={getPriorityColor}
                formatDate={formatDate}
                isOverdue={isOverdue}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

const TaskCard = ({
  task, onStatusChange, onAddComment,
  getStatusColor, getPriorityColor, formatDate, isOverdue,
}) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    onAddComment(task._id, commentText);
    setCommentText('');
  };

  return (
    <div style={styles.taskCard}>
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

      <p style={styles.taskDescription}>{task.description}</p>

      <div style={styles.taskMeta}>
        <span>📅 Due: {formatDate(task.dueDate)}</span>
        <span>💬 {task.comments?.length || 0} comments</span>
      </div>

      <div style={styles.taskActions}>
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task._id, e.target.value)}
          style={styles.statusSelect}
        >
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>

        <button
          style={styles.commentsBtn}
          onClick={() => setShowComments(!showComments)}
        >
          {showComments ? 'Hide Comments' : 'Show Comments'}
        </button>
      </div>

      {showComments && (
        <div style={styles.commentsSection}>
          {task.comments?.length === 0 && (
            <p style={styles.noComments}>No comments yet.</p>
          )}
          {task.comments?.map((comment, idx) => (
            <div key={idx} style={styles.comment}>
              <span style={styles.commentUser}>User {comment.userId}:</span>
              <span style={styles.commentText}>{comment.text}</span>
            </div>
          ))}
          <form onSubmit={handleCommentSubmit} style={styles.commentForm}>
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              style={styles.commentInput}
              placeholder="Add a comment..."
              required
            />
            <button type="submit" style={styles.commentSubmitBtn}>Post</button>
          </form>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: '900px', margin: '0 auto', padding: '2rem' },
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
  filters: { display: 'flex', gap: '1rem', marginBottom: '1.5rem' },
  filterSelect: { padding: '0.5rem 1rem', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '0.95rem', backgroundColor: 'white', cursor: 'pointer' },
  clearBtn: { padding: '0.5rem 1rem', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  emptyState: { textAlign: 'center', padding: '4rem 2rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  tasksList: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  taskCard: { backgroundColor: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  taskTitleRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '1rem', marginBottom: '0.75rem' },
  taskTitle: { fontSize: '1.2rem', color: '#2c3e50', margin: 0 },
  badges: { display: 'flex', gap: '0.5rem', flexShrink: 0 },
  badge: { padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.75rem', color: 'white', fontWeight: 'bold', whiteSpace: 'nowrap' },
  taskDescription: { color: '#7f8c8d', fontSize: '0.95rem', margin: '0 0 1rem' },
  taskMeta: { display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: '#95a5a6', marginBottom: '1rem' },
  taskActions: { display: 'flex', gap: '1rem', alignItems: 'center' },
  statusSelect: { padding: '0.5rem 1rem', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '0.9rem', cursor: 'pointer' },
  commentsBtn: { padding: '0.5rem 1rem', backgroundColor: '#ecf0f1', color: '#2c3e50', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem' },
  commentsSection: { marginTop: '1rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' },
  noComments: { color: '#95a5a6', fontSize: '0.9rem', marginBottom: '1rem' },
  comment: { display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.9rem' },
  commentUser: { fontWeight: 'bold', color: '#2c3e50', whiteSpace: 'nowrap' },
  commentText: { color: '#7f8c8d' },
  commentForm: { display: 'flex', gap: '0.5rem', marginTop: '1rem' },
  commentInput: { flex: 1, padding: '0.5rem 0.75rem', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '0.9rem', outline: 'none' },
  commentSubmitBtn: { padding: '0.5rem 1rem', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
};

export default MyTasks;