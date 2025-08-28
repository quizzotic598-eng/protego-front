import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { logout } from '../store/slices/authSlice';
import Login from '../components/Login';
import CustomerDashboard from '../components/CustomerDashboard';
import AgentDashboard from '../components/AgentDashboard';
import AdminDashboard from '../components/AdminDashboard';
import { Button } from '../components/ui/button';
import { LogOut } from 'lucide-react';

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
    <div className="relative">
      {/* Logout Button */}
      <div className="fixed top-4 right-4 z-50">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleLogout}
          className="bg-white/90 backdrop-blur shadow-card"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
      
      {renderDashboard()}
    </div>
  );
};

export default Index;
