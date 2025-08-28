import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { setPolicies, addPolicy } from '../store/slices/policiesSlice';
import { setClaims, updateClaim } from '../store/slices/claimsSlice';
import { setUsers } from '../store/slices/usersSlice';
import { mockPolicies, mockClaims, mockUsers } from '../data/mockData';
import { 
  Users, 
  FileText, 
  Shield, 
  Plus,
  Search, 
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle
} from 'lucide-react';
import styles from '../styles/Dashboard.module.css';

const AgentDashboard = () => {
  const { user } = useAppSelector(state => state.auth);
  const { policies } = useAppSelector(state => state.policies);
  const { claims } = useAppSelector(state => state.claims);
  const { users } = useAppSelector(state => state.users);
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('customers');

  useEffect(() => {
    // Load agent's assigned data
    const agentPolicies = mockPolicies.filter(p => p.agentId === user?.id);
    const agentClaims = mockClaims.filter(c => c.agentId === user?.id);
    const agentCustomers = mockUsers.filter(u => u.agentId === user?.id);
    
    dispatch(setPolicies(agentPolicies));
    dispatch(setClaims(agentClaims));
    dispatch(setUsers(agentCustomers));
  }, [dispatch, user?.id]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
      case 'completed':
      case 'approved':
        return <CheckCircle className={styles.icon} />;
      case 'pending':
      case 'processing':
        return <Clock className={styles.icon} />;
      case 'denied':
      case 'failed':
      case 'cancelled':
        return <XCircle className={styles.icon} />;
      default:
        return <AlertCircle className={styles.icon} />;
    }
  };

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

  const handleClaimAction = (claimId, newStatus) => {
    const claim = claims.find(c => c.id === claimId);
    if (claim) {
      const updatedClaim = {
        ...claim,
        status: newStatus,
        dateProcessed: new Date().toISOString().split('T')[0],
      };
      dispatch(updateClaim(updatedClaim));
      alert(`Claim ${claimId} has been ${newStatus}`);
    }
  };

  const handleCreatePolicy = () => {
    const newPolicy = {
      id: `pol-${Date.now()}`,
      customerId: users[0]?.id || '1',
      customerName: users[0]?.name || 'New Customer',
      type: 'auto',
      number: `AUTO-${Date.now()}`,
      status: 'pending',
      premium: 1000,
      coverage: 100000,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      agentId: user?.id || '',
      agentName: user?.name || '',
      documents: [],
    };
    
    dispatch(addPolicy(newPolicy));
    alert('New policy has been created successfully');
  };

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

  const filteredCustomers = users.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderCustomers = () => (
    <div className={styles.tabsContent}>
      {filteredCustomers.map((customer) => {
        const customerPolicies = policies.filter(p => p.customerId === customer.id);
        const customerClaims = claims.filter(c => c.customerId === customer.id);
        
        return (
          <div key={customer.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardHeaderContent}>
                <div>
                  <h3 className={styles.cardTitle}>{customer.name}</h3>
                  <p className={styles.cardDescription}>{customer.email}</p>
                </div>
                <button className={`${styles.button} ${styles.buttonSecondary}`}>
                  View Profile
                </button>
              </div>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.cardGrid}>
                <div className={styles.cardGridItem}>
                  <h4>Active Policies</h4>
                  <p>{customerPolicies.filter(p => p.status === 'active').length}</p>
                </div>
                <div className={styles.cardGridItem}>
                  <h4>Open Claims</h4>
                  <p>{customerClaims.filter(c => c.status === 'pending' || c.status === 'processing').length}</p>
                </div>
                <div className={styles.cardGridItem}>
                  <h4>Total Premium</h4>
                  <p>${customerPolicies.reduce((sum, p) => sum + p.premium, 0).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderPolicies = () => (
    <div className={styles.tabsContent}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3>Customer Policies</h3>
        <button 
          className={`${styles.button} ${styles.buttonPrimary}`}
          onClick={handleCreatePolicy}
        >
          <Plus className={styles.icon} />
          Create Policy
        </button>
      </div>
      
      {filteredPolicies.map((policy) => (
        <div key={policy.id} className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardHeaderContent}>
              <div>
                <h3 className={styles.cardTitle}>{policy.type.charAt(0).toUpperCase() + policy.type.slice(1)} Insurance</h3>
                <p className={styles.cardDescription}>
                  {policy.customerName} - Policy #{policy.number}
                </p>
              </div>
              <div className={`${styles.badge} ${getStatusBadgeClass(policy.status)}`}>
                {getStatusIcon(policy.status)}
                {policy.status}
              </div>
            </div>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.cardGrid}>
              <div className={styles.cardGridItem}>
                <h4>Premium</h4>
                <p>${policy.premium}/year</p>
              </div>
              <div className={styles.cardGridItem}>
                <h4>Coverage</h4>
                <p>${policy.coverage.toLocaleString()}</p>
              </div>
              <div className={styles.cardGridItem}>
                <h4>Start Date</h4>
                <p>{new Date(policy.startDate).toLocaleDateString()}</p>
              </div>
              <div className={styles.cardGridItem}>
                <h4>End Date</h4>
                <p>{new Date(policy.endDate).toLocaleDateString()}</p>
              </div>
            </div>
            <div className={styles.cardActions}>
              <button className={`${styles.button} ${styles.buttonSecondary}`}>
                <FileText className={styles.icon} />
                View Details
              </button>
              <button className={`${styles.button} ${styles.buttonSecondary}`}>
                Edit Policy
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderClaims = () => (
    <div className={styles.tabsContent}>
      <h3 style={{ marginBottom: '1.5rem' }}>Claims Requiring Action</h3>
      
      {filteredClaims
        .filter(claim => claim.status === 'pending' || claim.status === 'processing')
        .map((claim) => (
        <div key={claim.id} className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardHeaderContent}>
              <div>
                <h3 className={styles.cardTitle}>Claim #{claim.id}</h3>
                <p className={styles.cardDescription}>
                  {claim.customerName} - {claim.policyNumber}
                </p>
              </div>
              <div className={`${styles.badge} ${getStatusBadgeClass(claim.status)}`}>
                {getStatusIcon(claim.status)}
                {claim.status}
              </div>
            </div>
          </div>
          <div className={styles.cardContent}>
            <div style={{ marginBottom: '1rem' }}>
              <p>{claim.description}</p>
            </div>
            
            <div className={styles.cardGrid} style={{ marginBottom: '1rem' }}>
              <div className={styles.cardGridItem}>
                <h4>Amount</h4>
                <p>${claim.amount.toLocaleString()}</p>
              </div>
              <div className={styles.cardGridItem}>
                <h4>Type</h4>
                <p>{claim.type.charAt(0).toUpperCase() + claim.type.slice(1)}</p>
              </div>
              <div className={styles.cardGridItem}>
                <h4>Submitted</h4>
                <p>{new Date(claim.dateSubmitted).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className={styles.cardActions}>
              <button 
                className={`${styles.button} ${styles.buttonSuccess}`}
                onClick={() => handleClaimAction(claim.id, 'approved')}
              >
                <CheckCircle className={styles.icon} />
                Approve
              </button>
              <button 
                className={`${styles.button} ${styles.buttonDestructive}`}
                onClick={() => handleClaimAction(claim.id, 'denied')}
              >
                <XCircle className={styles.icon} />
                Deny
              </button>
              <button className={`${styles.button} ${styles.buttonSecondary}`}>
                <FileText className={styles.icon} />
                View Documents
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
          <h1 className={styles.headerTitle}>Agent Dashboard</h1>
          <p className={styles.headerSubtitle}>Manage your customers, policies, and claims</p>
        </div>
      </header>

      <div className={styles.main}>
        {/* Search */}
        <div className={styles.searchContainer}>
          <div className={styles.searchWrapper}>
            <Search className={styles.searchIcon} />
            <input
              placeholder="Search customers, policies, claims..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statCardContent}>
              <div className={styles.statInfo}>
                <h3>My Customers</h3>
                <p>{users.length}</p>
              </div>
              <Users className={`${styles.statIcon} ${styles.iconPrimary}`} />
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statCardContent}>
              <div className={styles.statInfo}>
                <h3>Active Policies</h3>
                <p>{policies.filter(p => p.status === 'active').length}</p>
              </div>
              <Shield className={`${styles.statIcon} ${styles.iconPrimary}`} />
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statCardContent}>
              <div className={styles.statInfo}>
                <h3>Pending Claims</h3>
                <p>{claims.filter(c => c.status === 'pending' || c.status === 'processing').length}</p>
              </div>
              <FileText className={`${styles.statIcon} ${styles.iconWarning}`} />
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statCardContent}>
              <div className={styles.statInfo}>
                <h3>Total Premium</h3>
                <p>${policies.reduce((sum, p) => sum + p.premium, 0).toLocaleString()}</p>
              </div>
              <Shield className={`${styles.statIcon} ${styles.iconSuccess}`} />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className={styles.tabs}>
          <div className={styles.tabsList}>
            <button 
              className={`${styles.tabsTrigger} ${activeTab === 'customers' ? styles.active : ''}`}
              onClick={() => setActiveTab('customers')}
            >
              My Customers
            </button>
            <button 
              className={`${styles.tabsTrigger} ${activeTab === 'policies' ? styles.active : ''}`}
              onClick={() => setActiveTab('policies')}
            >
              Policies
            </button>
            <button 
              className={`${styles.tabsTrigger} ${activeTab === 'claims' ? styles.active : ''}`}
              onClick={() => setActiveTab('claims')}
            >
              Claims to Process
            </button>
          </div>

          {activeTab === 'customers' && renderCustomers()}
          {activeTab === 'policies' && renderPolicies()}
          {activeTab === 'claims' && renderClaims()}
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;