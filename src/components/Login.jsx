import { useState } from 'react';
import { useAppDispatch } from '../hooks/redux';
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';
import { mockUsers } from '../data/mockData';
import { Shield, Mail, Lock } from 'lucide-react';
import styles from '../styles/Login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const dispatch = useAppDispatch();

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (!email || !password || !role) {
      alert('Please fill in all fields');
      return;
    }

    dispatch(loginStart());

    // Simulate API call
    setTimeout(() => {
      const user = mockUsers.find(u => u.role === role);
      if (user) {
        dispatch(loginSuccess(user));
        alert(`Welcome back, ${user.name}!`);
      } else {
        dispatch(loginFailure());
        alert('Invalid credentials');
      }
    }, 1000);
  };

  const getDemoCredentials = (userRole) => {
    const demoUser = mockUsers.find(u => u.role === userRole);
    return demoUser ? { email: demoUser.email, name: demoUser.name } : null;
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <Shield className={styles.logoIcon} />
          </div>
          <h1 className={styles.title}>SecureShield Insurance</h1>
          <p className={styles.subtitle}>Secure access to your insurance portal</p>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Sign In</h2>
            <p className={styles.cardDescription}>
              Access your insurance dashboard
            </p>
          </div>
          
          <form onSubmit={handleLogin} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="role" className={styles.label}>Role</label>
              <select 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                className={styles.select}
              >
                <option value="">Select your role</option>
                <option value="customer">Customer</option>
                <option value="agent">Agent</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>Email</label>
              <div className={styles.inputWrapper}>
                <Mail className={styles.inputIcon} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <div className={styles.inputWrapper}>
                <Lock className={styles.inputIcon} />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button type="submit" className={styles.submitButton}>
              Sign In
            </button>
          </form>

          {/* Demo credentials */}
          <div className={styles.demoCredentials}>
            <h4 className={styles.demoTitle}>Demo Credentials:</h4>
            <div className={styles.demoList}>
              <div><strong>Customer:</strong> {getDemoCredentials('customer')?.email}</div>
              <div><strong>Agent:</strong> {getDemoCredentials('agent')?.email}</div>
              <div><strong>Admin:</strong> {getDemoCredentials('admin')?.email}</div>
              <div className={styles.demoNote}>
                Password: demo123 (any password works)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;