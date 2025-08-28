import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { setPolicies } from '../store/slices/policiesSlice';
import { setClaims } from '../store/slices/claimsSlice';
import { setPayments } from '../store/slices/paymentsSlice';
import { setUsers, addUser, deleteUser } from '../store/slices/usersSlice';
import { mockPolicies, mockClaims, mockPayments, mockUsers } from '../data/mockData';
import { 
  Users, 
  FileText, 
  Shield, 
  DollarSign,
  TrendingUp,
  Search, 
  Plus,
  Edit,
  Trash2,
  BarChart3,
  PieChart
} from 'lucide-react';
import styles from '../styles/Dashboard.module.css';

const AdminDashboard = () => {
  const { user } = useAppSelector(state => state.auth);
  const { policies } = useAppSelector(state => state.policies);
  const { claims } = useAppSelector(state => state.claims);
  const { payments } = useAppSelector(state => state.payments);
  const { users } = useAppSelector(state => state.users);
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    // Load all data for admin
    dispatch(setPolicies(mockPolicies));
    dispatch(setClaims(mockClaims));
    dispatch(setPayments(mockPayments));
    dispatch(setUsers(mockUsers));
  }, [dispatch]);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active':
      case 'completed':
      case 'approved':
        return styles.badgeSuccess;
      case 'pending':
      case 'processing':
        return styles.badgeWarning;
      case 'denied':
      case 'failed':
      case 'cancelled':
        return styles.badgeDestructive;
      default:
        return styles.badgeDefault;
    }
  };

  const handleDeleteUser = (userId) => {
    dispatch(deleteUser(userId));
    alert('User has been removed from the system');
  };

  const handleAddUser = () => {
    const newUser = {
      id: `user-${Date.now()}`,
      email: 'new.user@email.com',
      name: 'New User',
      role: 'customer',
    };
    
    dispatch(addUser(newUser));
    alert('New user has been created successfully');
  };

  // Analytics data
  const totalPremiums = policies.reduce((sum, p) => sum + p.premium, 0);
  const totalClaims = claims.reduce((sum, c) => sum + c.amount, 0);

  const policyByType = policies.reduce((acc, policy) => {
    acc[policy.type] = (acc[policy.type] || 0) + 1;
    return acc;
  }, {});

  const claimsByStatus = claims.reduce((acc, claim) => {
    acc[claim.status] = (acc[claim.status] || 0) + 1;
    return acc;
  }, {});

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPolicies = policies.filter(policy =>
    policy.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    policy.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    policy.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredClaims = claims.filter(claim =>
    claim.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    claim.policyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    claim.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderAnalyticsBar = (value, total) => {
    const percentage = total > 0 ? (value / total) * 100 : 0;
    return (
      <div style={{ 
        width: '5rem', 
        height: '0.5rem', 
        backgroundColor: 'hsl(215, 25%, 95%)', 
        borderRadius: '9999px',
        overflow: 'hidden'
      }}>
        <div 
          style={{ 
            width: `${percentage}%`, 
            height: '100%', 
            backgroundColor: 'hsl(211, 95%, 45%)',
            borderRadius: '9999px'
          }}
        />
      </div>
    );
  };

  const renderUsers = () => (
    <div className={styles.tabsContent}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3>System Users</h3>
        <button 
          className={`${styles.button} ${styles.buttonPrimary}`}
          onClick={handleAddUser}
        >
          <Plus className={styles.icon} />
          Add User
        </button>
      </div>
      
      {filteredUsers.map((userItem) => (
        <div key={userItem.id} className={styles.card}>
          <div className={styles.cardContent}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div>
                  <p style={{ fontWeight: '600' }}>{userItem.name}</p>
                  <p style={{ fontSize: '0.875rem', color: 'hsl(215, 16%, 47%)' }}>{userItem.email}</p>
                </div>
                <div className={`${styles.badge} ${styles.badgeSuccess}`}>
                  {userItem.role}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className={`${styles.button} ${styles.buttonSecondary}`}>
                  <Edit className={styles.icon} />
                  Edit
                </button>
                <button 
                  className={`${styles.button} ${styles.buttonSecondary}`}
                  onClick={() => handleDeleteUser(userItem.id)}
                  disabled={userItem.id === user?.id}
                >
                  <Trash2 className={styles.icon} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderPolicies = () => (
    <div className={styles.tabsContent}>
      <h3 style={{ marginBottom: '1.5rem' }}>All Policies</h3>
      
      {filteredPolicies.map((policy) => (
        <div key={policy.id} className={styles.card}>
          <div className={styles.cardContent}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <p style={{ fontWeight: '600' }}>
                    {policy.type.charAt(0).toUpperCase() + policy.type.slice(1)} - {policy.number}
                  </p>
                  <div className={`${styles.badge} ${getStatusBadgeClass(policy.status)}`}>
                    {policy.status}
                  </div>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'hsl(215, 16%, 47%)' }}>
                  {policy.customerName} | Agent: {policy.agentName}
                </p>
                <p style={{ fontSize: '0.875rem' }}>
                  Premium: ${policy.premium} | Coverage: ${policy.coverage.toLocaleString()}
                </p>
              </div>
              <button className={`${styles.button} ${styles.buttonSecondary}`}>
                <FileText className={styles.icon} />
                View Details
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderClaims = () => (
    <div className={styles.tabsContent}>
      <h3 style={{ marginBottom: '1.5rem' }}>All Claims</h3>
      
      {filteredClaims.map((claim) => (
        <div key={claim.id} className={styles.card}>
          <div className={styles.cardContent}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <p style={{ fontWeight: '600' }}>Claim #{claim.id}</p>
                  <div className={`${styles.badge} ${getStatusBadgeClass(claim.status)}`}>
                    {claim.status}
                  </div>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'hsl(215, 16%, 47%)' }}>
                  {claim.customerName} | {claim.policyNumber}
                </p>
                <p style={{ fontSize: '0.875rem' }}>{claim.description}</p>
                <p style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                  Amount: ${claim.amount.toLocaleString()} | 
                  Submitted: {new Date(claim.dateSubmitted).toLocaleDateString()}
                </p>
              </div>
              <button className={`${styles.button} ${styles.buttonSecondary}`}>
                <FileText className={styles.icon} />
                Review
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.headerTitle}>Administrator Dashboard</h1>
          <p className={styles.headerSubtitle}>System overview and management</p>
        </div>
      </header>

      <div className={styles.main}>
        {/* Search */}
        <div className={styles.searchContainer}>
          <div className={styles.searchWrapper}>
            <Search className={styles.searchIcon} />
            <input
              placeholder="Search users, policies, claims..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        {/* Overview Stats */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statCardContent}>
              <div className={styles.statInfo}>
                <h3>Total Users</h3>
                <p>{users.length}</p>
                <p style={{ fontSize: '0.75rem', color: 'hsl(215, 16%, 47%)' }}>
                  {users.filter(u => u.role === 'customer').length} customers, {users.filter(u => u.role === 'agent').length} agents
                </p>
              </div>
              <Users className={`${styles.statIcon} ${styles.iconPrimary}`} />
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statCardContent}>
              <div className={styles.statInfo}>
                <h3>Total Policies</h3>
                <p>{policies.length}</p>
                <p style={{ fontSize: '0.75rem', color: 'hsl(215, 16%, 47%)' }}>
                  {policies.filter(p => p.status === 'active').length} active
                </p>
              </div>
              <Shield className={`${styles.statIcon} ${styles.iconPrimary}`} />
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statCardContent}>
              <div className={styles.statInfo}>
                <h3>Total Claims</h3>
                <p>{claims.length}</p>
                <p style={{ fontSize: '0.75rem', color: 'hsl(215, 16%, 47%)' }}>
                  ${totalClaims.toLocaleString()} total value
                </p>
              </div>
              <FileText className={`${styles.statIcon} ${styles.iconWarning}`} />
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statCardContent}>
              <div className={styles.statInfo}>
                <h3>Revenue</h3>
                <p>${totalPremiums.toLocaleString()}</p>
                <p style={{ 
                  fontSize: '0.75rem', 
                  color: 'hsl(142, 76%, 36%)', 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  <TrendingUp style={{ width: '0.75rem', height: '0.75rem' }} />
                  +12% this quarter
                </p>
              </div>
              <DollarSign className={`${styles.statIcon} ${styles.iconSuccess}`} />
            </div>
          </div>
        </div>

        {/* Analytics Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '1.5rem', 
          marginBottom: '2rem' 
        }}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <PieChart className={styles.icon} />
                Policies by Type
              </h3>
            </div>
            <div className={styles.cardContent}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {Object.entries(policyByType).map(([type, count]) => (
                  <div key={type} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ textTransform: 'capitalize' }}>{type}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {renderAnalyticsBar(count, policies.length)}
                      <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BarChart3 className={styles.icon} />
                Claims Status
              </h3>
            </div>
            <div className={styles.cardContent}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {Object.entries(claimsByStatus).map(([status, count]) => (
                  <div key={status} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div className={`${styles.badge} ${getStatusBadgeClass(status)}`}>
                        {status}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {renderAnalyticsBar(count, claims.length)}
                      <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className={styles.tabs}>
          <div className={styles.tabsList}>
            <button 
              className={`${styles.tabsTrigger} ${activeTab === 'users' ? styles.active : ''}`}
              onClick={() => setActiveTab('users')}
            >
              User Management
            </button>
            <button 
              className={`${styles.tabsTrigger} ${activeTab === 'policies' ? styles.active : ''}`}
              onClick={() => setActiveTab('policies')}
            >
              All Policies
            </button>
            <button 
              className={`${styles.tabsTrigger} ${activeTab === 'claims' ? styles.active : ''}`}
              onClick={() => setActiveTab('claims')}
            >
              All Claims
            </button>
          </div>

          {activeTab === 'users' && renderUsers()}
          {activeTab === 'policies' && renderPolicies()}
          {activeTab === 'claims' && renderClaims()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;