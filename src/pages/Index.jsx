import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { logout } from '../store/slices/authSlice';
import Login from '../components/Login';
import CustomerDashboard from '../components/CustomerDashboard';
import AgentDashboard from '../components/AgentDashboard';
import AdminDashboard from '../components/AdminDashboard';
import { LogOut } from 'lucide-react';
import styles from '../styles/Dashboard.module.css';

const Index = () => {
  const { isAuthenticated, user } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  if (!isAuthenticated || !user) {
    return <Login />;
  }

  const renderDashboard = () => {
    switch (user.role) {
      case 'customer':
        return <CustomerDashboard />;
      case 'agent':
        return <AgentDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <Login />;
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Logout Button */}
      <div className={styles.logoutButton}>
        <button 
          className={`${styles.button} ${styles.buttonSecondary}`}
          onClick={handleLogout}
        >
          <LogOut style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
          Logout
        </button>
      </div>
      
      {renderDashboard()}
    </div>
  );
};

export default Index;
