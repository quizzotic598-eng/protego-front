import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { setPolicies } from '../store/slices/policiesSlice';
import { setClaims } from '../store/slices/claimsSlice';
import { setPayments } from '../store/slices/paymentsSlice';
import { mockPolicies, mockClaims, mockPayments } from '../data/mockData';
import { 
  FileText, 
  Shield, 
  DollarSign, 
  Search, 
  Upload, 
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';
import styles from '../styles/Dashboard.module.css';

const CustomerDashboard = () => {
  const { user } = useAppSelector(state => state.auth);
  const { policies } = useAppSelector(state => state.policies);
  const { claims } = useAppSelector(state => state.claims);
  const { payments } = useAppSelector(state => state.payments);
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('policies');

  useEffect(() => {
    // Load customer's data
    const customerPolicies = mockPolicies.filter(p => p.customerId === user?.id);
    const customerClaims = mockClaims.filter(c => c.customerId === user?.id);
    const customerPayments = mockPayments.filter(p => p.customerId === user?.id);
    
    dispatch(setPolicies(customerPolicies));
    dispatch(setClaims(customerClaims));
    dispatch(setPayments(customerPayments));
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

  const filteredPolicies = policies.filter(policy =>
    policy.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    policy.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredClaims = claims.filter(claim =>
    claim.policyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    claim.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPayments = payments.filter(payment =>
    payment.policyNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderPolicies = () => (
    <div className={styles.tabsContent}>
      {filteredPolicies.map((policy) => (
        <div key={policy.id} className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardHeaderContent}>
              <div>
                <h3 className={styles.cardTitle}>{policy.type.charAt(0).toUpperCase() + policy.type.slice(1)} Insurance</h3>
                <p className={styles.cardDescription}>Policy #{policy.number}</p>
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
                <h4>Agent</h4>
                <p>{policy.agentName}</p>
              </div>
            </div>
            <div className={styles.cardActions}>
              <button className={`${styles.button} ${styles.buttonSecondary}`}>
                <FileText className={styles.icon} />
                View Details
              </button>
              <button className={`${styles.button} ${styles.buttonSecondary}`}>
                <Upload className={styles.icon} />
                Upload Document
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderClaims = () => (
    <div className={styles.tabsContent}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3>My Claims</h3>
        <button className={`${styles.button} ${styles.buttonPrimary}`}>
          <FileText className={styles.icon} />
          File New Claim
        </button>
      </div>
      
      {filteredClaims.map((claim) => (
        <div key={claim.id} className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardHeaderContent}>
              <div>
                <h3 className={styles.cardTitle}>Claim #{claim.id}</h3>
                <p className={styles.cardDescription}>{claim.description}</p>
              </div>
              <div className={`${styles.badge} ${getStatusBadgeClass(claim.status)}`}>
                {getStatusIcon(claim.status)}
                {claim.status}
              </div>
            </div>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.cardGrid}>
              <div className={styles.cardGridItem}>
                <h4>Policy</h4>
                <p>{claim.policyNumber}</p>
              </div>
              <div className={styles.cardGridItem}>
                <h4>Amount</h4>
                <p>${claim.amount.toLocaleString()}</p>
              </div>
              <div className={styles.cardGridItem}>
                <h4>Submitted</h4>
                <p>{new Date(claim.dateSubmitted).toLocaleDateString()}</p>
              </div>
            </div>
            <div className={styles.cardActions}>
              <button className={`${styles.button} ${styles.buttonSecondary}`}>
                <FileText className={styles.icon} />
                View Details
              </button>
              <button className={`${styles.button} ${styles.buttonSecondary}`}>
                <Upload className={styles.icon} />
                Upload Document
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderPayments = () => (
    <div className={styles.tabsContent}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3>Payment History</h3>
        <button className={`${styles.button} ${styles.buttonPrimary}`}>
          <DollarSign className={styles.icon} />
          Make Payment
        </button>
      </div>
      
      {filteredPayments.map((payment) => (
        <div key={payment.id} className={styles.card}>
          <div className={styles.cardContent}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div className={`${styles.badge} ${getStatusBadgeClass(payment.status)}`}>
                  {getStatusIcon(payment.status)}
                  {payment.status}
                </div>
                <div>
                  <p style={{ fontWeight: '600' }}>${payment.amount}</p>
                  <p style={{ fontSize: '0.875rem', color: 'hsl(215, 16%, 47%)' }}>
                    {payment.type} - {payment.policyNumber}
                  </p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '0.875rem', color: 'hsl(215, 16%, 47%)' }}>
                  {payment.method.replace('_', ' ')}
                </p>
                <p style={{ fontSize: '0.875rem' }}>
                  {new Date(payment.date).toLocaleDateString()}
                </p>
              </div>
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
          <h1 className={styles.headerTitle}>Welcome back, {user?.name}!</h1>
          <p className={styles.headerSubtitle}>Manage your policies, claims, and payments</p>
        </div>
      </header>

      <div className={styles.main}>
        {/* Search */}
        <div className={styles.searchContainer}>
          <div className={styles.searchWrapper}>
            <Search className={styles.searchIcon} />
            <input
              placeholder="Search policies, claims..."
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
                <h3>Active Policies</h3>
                <p>{policies.filter(p => p.status === 'active').length}</p>
              </div>
              <Shield className={`${styles.statIcon} ${styles.iconPrimary}`} />
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statCardContent}>
              <div className={styles.statInfo}>
                <h3>Open Claims</h3>
                <p>{claims.filter(c => c.status === 'pending' || c.status === 'processing').length}</p>
              </div>
              <FileText className={`${styles.statIcon} ${styles.iconPrimary}`} />
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statCardContent}>
              <div className={styles.statInfo}>
                <h3>Pending Payments</h3>
                <p>{payments.filter(p => p.status === 'pending').length}</p>
              </div>
              <DollarSign className={`${styles.statIcon} ${styles.iconPrimary}`} />
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statCardContent}>
              <div className={styles.statInfo}>
                <h3>Total Coverage</h3>
                <p>${policies.reduce((sum, p) => sum + p.coverage, 0).toLocaleString()}</p>
              </div>
              <Shield className={`${styles.statIcon} ${styles.iconSuccess}`} />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className={styles.tabs}>
          <div className={styles.tabsList}>
            <button 
              className={`${styles.tabsTrigger} ${activeTab === 'policies' ? styles.active : ''}`}
              onClick={() => setActiveTab('policies')}
            >
              My Policies
            </button>
            <button 
              className={`${styles.tabsTrigger} ${activeTab === 'claims' ? styles.active : ''}`}
              onClick={() => setActiveTab('claims')}
            >
              My Claims
            </button>
            <button 
              className={`${styles.tabsTrigger} ${activeTab === 'payments' ? styles.active : ''}`}
              onClick={() => setActiveTab('payments')}
            >
              Payment History
            </button>
          </div>

          {activeTab === 'policies' && renderPolicies()}
          {activeTab === 'claims' && renderClaims()}
          {activeTab === 'payments' && renderPayments()}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;