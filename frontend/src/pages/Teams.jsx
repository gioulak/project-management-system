import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Layout/Navbar';
import { teamService, adminService } from '../services/api';

const Teams = () => {
  const { user, isAdmin, isTeamLeader } = useAuth();
  const navigate = useNavigate();

  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [allUsers, setAllUsers] = useState([]);

  const [newTeam, setNewTeam] = useState({
    name: '',
    description: '',
    leader: '',
  });

  const [newMemberId, setNewMemberId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchTeams();
    if (isAdmin()) {
      fetchUsers();
    }
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await teamService.getAllTeams();
      setTeams(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching teams:', error);
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await adminService.getAllUsers();
      const activeUsers = response.data.filter((u) => u.is_active);
      setAllUsers(activeUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await teamService.createTeam(newTeam);
      setSuccess('Team created successfully!');
      setShowCreateModal(false);
      setNewTeam({ name: '', description: '', leader: '' });
      fetchTeams();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create team');
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await teamService.addMember(selectedTeam._id, parseInt(newMemberId));
      setSuccess('Member added successfully!');
      setShowAddMemberModal(false);
      setNewMemberId('');
      setSelectedTeam(null);
      fetchTeams();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (teamId, userId) => {
    if (!window.confirm('Are you sure you want to remove this member?')) return;

    try {
      await teamService.removeMember(teamId, userId);
      setSuccess('Member removed successfully!');
      fetchTeams();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to remove member');
    }
  };

  const handleDeleteTeam = async (teamId) => {
    if (!window.confirm('Are you sure you want to delete this team?')) return;

    try {
      await teamService.deleteTeam(teamId);
      setSuccess('Team deleted successfully!');
      fetchTeams();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to delete team');
    }
  };

  const getUserName = (userId) => {
    const foundUser = allUsers.find((u) => u.id === userId);
    return foundUser ? `${foundUser.first_name} ${foundUser.last_name}` : `User ${userId}`;
  };

  const isTeamLeaderOf = (team) => {
    return team.leader === user?.id;
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div style={styles.loading}>Loading teams...</div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Teams</h1>
            <p style={styles.subtitle}>Manage your teams and members</p>
          </div>
          {isAdmin() && (
            <button style={styles.createBtn} onClick={() => setShowCreateModal(true)}>
              + Create Team
            </button>
          )}
        </div>

        {success && <div style={styles.success}>{success}</div>}
        {error && <div style={styles.error}>{error}</div>}

        {teams.length === 0 ? (
          <div style={styles.emptyState}>
            <h2>No teams found</h2>
            <p>You are not part of any team yet.</p>
            {isAdmin() && (
              <button style={styles.primaryBtn} onClick={() => setShowCreateModal(true)}>
                Create Your First Team
              </button>
            )}
          </div>
        ) : (
          <div style={styles.teamsGrid}>
            {teams.map((team) => (
              <div key={team._id} style={styles.teamCard}>
                <div style={styles.teamHeader}>
                  <div>
                    <h3 style={styles.teamName}>{team.name}</h3>
                    <p style={styles.teamDescription}>{team.description}</p>
                  </div>
                  {(isAdmin() || isTeamLeaderOf(team)) && (
                    <div style={styles.teamActions}>
                      {isAdmin() && (
                        <button
                          style={styles.deleteBtn}
                          onClick={() => handleDeleteTeam(team._id)}
                          title="Delete Team"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div style={styles.teamInfo}>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>👤 Leader:</span>
                    <span style={styles.infoValue}>
                      {isAdmin() ? getUserName(team.leader) : `User ${team.leader}`}
                      {team.leader === user?.id && ' (You)'}
                    </span>
                  </div>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>👥 Members:</span>
                    <span style={styles.infoValue}>{team.members.length}</span>
                  </div>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>📅 Created:</span>
                    <span style={styles.infoValue}>
                      {new Date(team.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div style={styles.membersSection}>
                  <div style={styles.membersSectionHeader}>
                    <h4 style={styles.membersTitle}>Team Members</h4>
                    {(isTeamLeaderOf(team) || isAdmin()) && (
                      <button
                        style={styles.addMemberBtn}
                        onClick={() => {
                          setSelectedTeam(team);
                          setShowAddMemberModal(true);
                        }}
                      >
                        + Add
                      </button>
                    )}
                  </div>
                  <div style={styles.membersList}>
                    {team.members.map((memberId) => (
                      <div key={memberId} style={styles.memberItem}>
                        <span style={styles.memberName}>
                          {isAdmin() ? getUserName(memberId) : `User ${memberId}`}
                          {memberId === team.leader && ' 👑'}
                          {memberId === user?.id && ' (You)'}
                        </span>
                        {(isTeamLeaderOf(team) || isAdmin()) && memberId !== team.leader && (
                          <button
                            style={styles.removeMemberBtn}
                            onClick={() => handleRemoveMember(team._id, memberId)}
                            title="Remove Member"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  style={styles.viewTasksBtn}
                  onClick={() => navigate(`/tasks?teamId=${team._id}`)}
                >
                  View Team Tasks →
                </button>
              </div>
            ))}
          </div>
        )}

        {showCreateModal && (
          <div style={styles.modalOverlay} onClick={() => setShowCreateModal(false)}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <h2 style={styles.modalTitle}>Create New Team</h2>
              <form onSubmit={handleCreateTeam} style={styles.form}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Team Name</label>
                  <input
                    type="text"
                    value={newTeam.name}
                    onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                    style={styles.input}
                    placeholder="e.g., Development Team"
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Description</label>
                  <textarea
                    value={newTeam.description}
                    onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                    style={{ ...styles.input, minHeight: '100px', resize: 'vertical' }}
                    placeholder="Brief description of the team"
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Team Leader</label>
                  <select
                    value={newTeam.leader}
                    onChange={(e) => setNewTeam({ ...newTeam, leader: parseInt(e.target.value) })}
                    style={styles.input}
                    required
                  >
                    <option value="">Select a leader</option>
                    {allUsers
                      .filter((u) => u.role === 'TEAM_LEADER' || u.role === 'ADMIN')
                      .map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.first_name} {user.last_name} ({user.username})
                        </option>
                      ))}
                  </select>
                </div>

                <div style={styles.modalButtons}>
                  <button type="button" style={styles.cancelBtn} onClick={() => setShowCreateModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" style={styles.submitBtn}>
                    Create Team
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showAddMemberModal && selectedTeam && (
          <div style={styles.modalOverlay} onClick={() => setShowAddMemberModal(false)}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <h2 style={styles.modalTitle}>Add Member to {selectedTeam.name}</h2>
              <form onSubmit={handleAddMember} style={styles.form}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Select Member</label>
                  <select
                    value={newMemberId}
                    onChange={(e) => setNewMemberId(e.target.value)}
                    style={styles.input}
                    required
                  >
                    <option value="">Choose a user</option>
                    {allUsers
                      .filter((u) => !selectedTeam.members.includes(u.id))
                      .map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.first_name} {user.last_name} ({user.role})
                        </option>
                      ))}
                  </select>
                </div>

                <div style={styles.modalButtons}>
                  <button type="button" style={styles.cancelBtn} onClick={() => setShowAddMemberModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" style={styles.submitBtn}>
                    Add Member
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
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
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    color: '#2c3e50',
    marginBottom: '0.5rem',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#7f8c8d',
  },
  createBtn: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  success: {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    border: '1px solid #c3e6cb',
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    border: '1px solid #f5c6cb',
  },
  emptyState: {
    textAlign: 'center',
    padding: '4rem 2rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  primaryBtn: {
    marginTop: '1rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  teamsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '1.5rem',
  },
  teamCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  teamHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    marginBottom: '1rem',
    paddingBottom: '1rem',
    borderBottom: '2px solid #ecf0f1',
  },
  teamName: {
    fontSize: '1.5rem',
    color: '#2c3e50',
    marginBottom: '0.5rem',
    fontWeight: 'bold',
  },
  teamDescription: {
    color: '#7f8c8d',
    fontSize: '0.95rem',
  },
  teamActions: {
    display: 'flex',
    gap: '0.5rem',
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    fontSize: '1.2rem',
    cursor: 'pointer',
  },
  teamInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginBottom: '1rem',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.95rem',
  },
  infoLabel: {
    color: '#7f8c8d',
    fontWeight: '600',
  },
  infoValue: {
    color: '#2c3e50',
  },
  membersSection: {
    marginTop: '1rem',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
  },
  membersSectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.75rem',
  },
  membersTitle: {
    fontSize: '1rem',
    color: '#2c3e50',
    margin: 0,
  },
  addMemberBtn: {
    padding: '0.25rem 0.75rem',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '0.85rem',
    cursor: 'pointer',
  },
  membersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  memberItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem',
    backgroundColor: 'white',
    borderRadius: '4px',
    fontSize: '0.9rem',
  },
  memberName: {
    color: '#2c3e50',
  },
  removeMemberBtn: {
    background: 'none',
    border: 'none',
    color: '#e74c3c',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  viewTasksBtn: {
    width: '100%',
    marginTop: '1rem',
    padding: '0.75rem',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  modalTitle: {
    fontSize: '1.5rem',
    color: '#2c3e50',
    marginBottom: '1.5rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '0.5rem',
    fontWeight: '600',
    color: '#2c3e50',
    fontSize: '0.95rem',
  },
  input: {
    padding: '0.75rem',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '1rem',
    outline: 'none',
  },
  modalButtons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end',
    marginTop: '1rem',
  },
  cancelBtn: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  submitBtn: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

export default Teams;
