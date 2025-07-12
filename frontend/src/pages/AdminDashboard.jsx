import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { logout } from '../lib/api';
import { checkAuth } from '../lib/api';

const TABS = [
  { key: 'skills', label: 'Skill Moderation' },
  { key: 'users', label: 'User Management' },
  { key: 'swaps', label: 'Swap Monitoring' },
  { key: 'messages', label: 'Platform Messages' },
  { key: 'reports', label: 'Reports' },
];

const API_BASE = '/auth/admin';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('skills');
  const navigate = useNavigate();
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth().then(res => {
      const user = res.data.user;
      if (
        res.data.authenticated &&
        (user.is_admin || user.is_staff || user.is_superuser || user.role === 'admin')
      ) {
        setIsAdminAuthenticated(true);
      } else {
        setIsAdminAuthenticated(false);
        navigate('/login', { replace: true });
      }
    }).catch(() => {
      setIsAdminAuthenticated(false);
      navigate('/login', { replace: true });
    });
  }, [navigate]);

  // Skill Moderation
  const [skills, setSkills] = useState([]);
  const [skillsLoading, setSkillsLoading] = useState(false);
  const [skillsError, setSkillsError] = useState(null);
  const [skillStatusFilter, setSkillStatusFilter] = useState('');

  // User Management
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState(null);

  // Swap Monitoring
  const [swaps, setSwaps] = useState([]);
  const [swapsLoading, setSwapsLoading] = useState(false);
  const [swapsError, setSwapsError] = useState(null);

  // Platform Messages
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(null);
  const [newMessage, setNewMessage] = useState({ title: '', body: '', is_active: true });
  const [messageFormLoading, setMessageFormLoading] = useState(false);

  // Reports
  const [downloading, setDownloading] = useState('');

  // Fetch Skills
  useEffect(() => {
    if (activeTab === 'skills' && isAdminAuthenticated) {
      setSkillsLoading(true);
      api.get(`${API_BASE}/user-skills/`).then(res => {
        setSkills(res.data);
        setSkillsLoading(false);
      }).catch(e => {
        setSkillsError('Failed to load skills');
        setSkillsLoading(false);
      });
    }
  }, [activeTab, isAdminAuthenticated]);

  // Fetch Users
  useEffect(() => {
    if (activeTab === 'users' && isAdminAuthenticated) {
      setUsersLoading(true);
      api.get(`${API_BASE}/users/`).then(res => {
        setUsers(res.data);
        setUsersLoading(false);
      }).catch(e => {
        setUsersError('Failed to load users');
        setUsersLoading(false);
      });
    }
  }, [activeTab, isAdminAuthenticated]);

  // Fetch Swaps
  useEffect(() => {
    if (activeTab === 'swaps' && isAdminAuthenticated) {
      setSwapsLoading(true);
      api.get(`${API_BASE}/swaps/`).then(res => {
        setSwaps(res.data);
        setSwapsLoading(false);
      }).catch(e => {
        setSwapsError('Failed to load swaps');
        setSwapsLoading(false);
      });
    }
  }, [activeTab, isAdminAuthenticated]);

  // Fetch Messages
  useEffect(() => {
    if (activeTab === 'messages' && isAdminAuthenticated) {
      setMessagesLoading(true);
      api.get(`${API_BASE}/messages/`).then(res => {
        setMessages(res.data);
        setMessagesLoading(false);
      }).catch(e => {
        setMessagesError('Failed to load messages');
        setMessagesLoading(false);
      });
    }
  }, [activeTab, isAdminAuthenticated]);

  // Skill Moderation Actions
  const handleApproveSkill = (id) => {
    api.post(`${API_BASE}/user-skills/${id}/approve/`).then(() => {
      setSkills(skills => skills.map(s => s.id === id ? { ...s, status: 'approved', rejection_reason: '' } : s));
    });
  };
  const handleRejectSkill = (id) => {
    const reason = prompt('Enter rejection reason:') || 'Rejected by admin.';
    api.post(`${API_BASE}/user-skills/${id}/reject/`, { rejection_reason: reason }).then(() => {
      setSkills(skills => skills.map(s => s.id === id ? { ...s, status: 'rejected', rejection_reason: reason } : s));
    });
  };

  // User Management Actions
  const handleBanUser = (id) => {
    api.post(`${API_BASE}/users/${id}/ban/`).then(() => {
      setUsers(users => users.map(u => u.id === id ? { ...u, is_banned: true } : u));
    });
  };
  const handleUnbanUser = (id) => {
    api.post(`${API_BASE}/users/${id}/unban/`).then(() => {
      setUsers(users => users.map(u => u.id === id ? { ...u, is_banned: false } : u));
    });
  };

  // Platform Message Actions
  const handleCreateMessage = (e) => {
    e.preventDefault();
    setMessageFormLoading(true);
    api.post(`${API_BASE}/messages/`, newMessage).then(res => {
      setMessages([res.data, ...messages]);
      setNewMessage({ title: '', body: '', is_active: true });
      setMessageFormLoading(false);
    }).catch(() => setMessageFormLoading(false));
  };
  const handleUpdateMessage = (id, data) => {
    api.patch(`${API_BASE}/messages/${id}/`, data).then(res => {
      setMessages(msgs => msgs.map(m => m.id === id ? res.data : m));
    });
  };

  // Reports Download
  const handleDownload = (type) => {
    setDownloading(type);
    api.get(`${API_BASE}/export/${type}/`, { responseType: 'blob' }).then(res => {
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setDownloading('');
    });
  };

  const handleLogout = async () => {
    console.log("Logging out (admin)");
    try {
      await logout();
    } catch (e) {}
    // Robustly clear cached auth state
    if (window.localStorage) {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("currentUser");
    }
    if (window.sessionStorage) {
      sessionStorage.clear();
    }
    if (window.queryClient) {
      window.queryClient.removeQueries && window.queryClient.removeQueries('auth');
    } else if (typeof window !== 'undefined' && window.__REACT_QUERY_CLIENT__) {
      window.__REACT_QUERY_CLIENT__.removeQueries('auth');
    }
    // Optionally, force reload to clear any lingering state
    // window.location.href = '/login';
    navigate('/login', { replace: true });
    window.location.href = '/login';
  };

  // Filtered skills
  const filteredSkills = skillStatusFilter ? skills.filter(s => s.status === skillStatusFilter) : skills;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white shadow-sm px-4 py-4 flex items-center gap-4">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button className="ml-auto px-4 py-2 bg-red-500 text-white rounded" onClick={handleLogout}>Logout</button>
      </header>
      <nav className="flex gap-2 px-4 py-2 bg-white border-b">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`px-4 py-2 rounded-lg font-medium ${activeTab === tab.key ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Skill Moderation */}
        {activeTab === 'skills' && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Skill Moderation</h2>
            <div className="mb-2 flex gap-2 items-center">
              <label>Status:</label>
              <select value={skillStatusFilter} onChange={e => setSkillStatusFilter(e.target.value)} className="border rounded px-2 py-1">
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 overflow-x-auto">
              {skillsLoading ? 'Loading...' : skillsError ? skillsError : (
                <table className="min-w-full text-sm">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Skill</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Rejection Reason</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSkills.map(skill => (
                      <tr key={skill.id} className="border-b">
                        <td>{skill.user}</td>
                        <td>{skill.skill_name}</td>
                        <td>{skill.skill_type}</td>
                        <td>{skill.status}</td>
                        <td>{skill.rejection_reason}</td>
                        <td className="flex gap-2">
                          {skill.status !== 'approved' && <button className="px-2 py-1 bg-green-500 text-white rounded" onClick={() => handleApproveSkill(skill.id)}>Approve</button>}
                          {skill.status !== 'rejected' && <button className="px-2 py-1 bg-red-500 text-white rounded" onClick={() => handleRejectSkill(skill.id)}>Reject</button>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        )}
        {/* User Management */}
        {activeTab === 'users' && (
          <section>
            <h2 className="text-xl font-semibold mb-4">User Management</h2>
            <div className="bg-white rounded-lg shadow-sm p-6 overflow-x-auto">
              {usersLoading ? 'Loading...' : usersError ? usersError : (
                <table className="min-w-full text-sm">
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Full Name</th>
                      <th>Admin</th>
                      <th>Banned</th>
                      <th>Created At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id} className="border-b">
                        <td>{user.email}</td>
                        <td>{user.full_name}</td>
                        <td>{user.is_admin ? 'Yes' : 'No'}</td>
                        <td>{user.is_banned ? 'Yes' : 'No'}</td>
                        <td>{new Date(user.created_at).toLocaleString()}</td>
                        <td className="flex gap-2">
                          {user.is_banned ? (
                            <button className="px-2 py-1 bg-green-500 text-white rounded" onClick={() => handleUnbanUser(user.id)}>Unban</button>
                          ) : (
                            <button className="px-2 py-1 bg-red-500 text-white rounded" onClick={() => handleBanUser(user.id)}>Ban</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        )}
        {/* Swap Monitoring */}
        {activeTab === 'swaps' && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Swap Monitoring</h2>
            <div className="bg-white rounded-lg shadow-sm p-6 overflow-x-auto">
              {swapsLoading ? 'Loading...' : swapsError ? swapsError : (
                <table className="min-w-full text-sm">
                  <thead>
                    <tr>
                      <th>From User</th>
                      <th>To User</th>
                      <th>Skill Offered</th>
                      <th>Skill Wanted</th>
                      <th>Status</th>
                      <th>Duration</th>
                      <th>Preferred Time</th>
                      <th>Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {swaps.map(swap => (
                      <tr key={swap.id} className="border-b">
                        <td>{swap.from_user?.full_name}</td>
                        <td>{swap.to_user?.full_name}</td>
                        <td>{swap.skill_offered?.name}</td>
                        <td>{swap.skill_wanted?.name}</td>
                        <td>{swap.status}</td>
                        <td>{swap.duration}</td>
                        <td>{swap.preferred_time}</td>
                        <td>{new Date(swap.created_at).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        )}
        {/* Platform Messages */}
        {activeTab === 'messages' && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Platform Messages</h2>
            <form className="mb-4 flex flex-col gap-2 bg-white rounded-lg shadow-sm p-6 max-w-xl" onSubmit={handleCreateMessage}>
              <input className="border rounded px-2 py-1" placeholder="Title" value={newMessage.title} onChange={e => setNewMessage(m => ({ ...m, title: e.target.value }))} required />
              <textarea className="border rounded px-2 py-1" placeholder="Body" value={newMessage.body} onChange={e => setNewMessage(m => ({ ...m, body: e.target.value }))} required />
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={newMessage.is_active} onChange={e => setNewMessage(m => ({ ...m, is_active: e.target.checked }))} /> Active
              </label>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded" type="submit" disabled={messageFormLoading}>{messageFormLoading ? 'Creating...' : 'Create Message'}</button>
            </form>
            <div className="bg-white rounded-lg shadow-sm p-6 overflow-x-auto">
              {messagesLoading ? 'Loading...' : messagesError ? messagesError : (
                <table className="min-w-full text-sm">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Body</th>
                      <th>Active</th>
                      <th>Created At</th>
                      <th>Expires At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {messages.map(msg => (
                      <tr key={msg.id} className="border-b">
                        <td>{msg.title}</td>
                        <td>{msg.body}</td>
                        <td>{msg.is_active ? 'Yes' : 'No'}</td>
                        <td>{new Date(msg.created_at).toLocaleString()}</td>
                        <td>{msg.expires_at ? new Date(msg.expires_at).toLocaleString() : '-'}</td>
                        <td>
                          <button className="px-2 py-1 bg-yellow-500 text-white rounded" onClick={() => handleUpdateMessage(msg.id, { is_active: !msg.is_active })}>{msg.is_active ? 'Deactivate' : 'Activate'}</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        )}
        {/* Reports */}
        {activeTab === 'reports' && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Reports</h2>
            <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col gap-4">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded w-48" onClick={() => handleDownload('users')} disabled={downloading === 'users'}>{downloading === 'users' ? 'Downloading...' : 'Download Users CSV'}</button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded w-48" onClick={() => handleDownload('swaps')} disabled={downloading === 'swaps'}>{downloading === 'swaps' ? 'Downloading...' : 'Download Swaps CSV'}</button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded w-48" onClick={() => handleDownload('ratings')} disabled={downloading === 'ratings'}>{downloading === 'ratings' ? 'Downloading...' : 'Download Feedback CSV'}</button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
} 