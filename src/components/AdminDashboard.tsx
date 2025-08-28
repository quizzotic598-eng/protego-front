import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { setPolicies } from '../store/slices/policiesSlice';
import { setClaims } from '../store/slices/claimsSlice';
import { setPayments } from '../store/slices/paymentsSlice';
import { setUsers, addUser, updateUser, deleteUser } from '../store/slices/usersSlice';
import { mockPolicies, mockClaims, mockPayments, mockUsers } from '../data/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
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
import { useToast } from '../hooks/use-toast';

const AdminDashboard = () => {
  const { user } = useAppSelector(state => state.auth);
  const { policies } = useAppSelector(state => state.policies);
  const { claims } = useAppSelector(state => state.claims);
  const { payments } = useAppSelector(state => state.payments);
  const { users } = useAppSelector(state => state.users);
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Load all data for admin
    dispatch(setPolicies(mockPolicies));
    dispatch(setClaims(mockClaims));
    dispatch(setPayments(mockPayments));
    dispatch(setUsers(mockUsers));
  }, [dispatch]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'completed':
      case 'approved':
        return 'bg-success text-success-foreground';
      case 'pending':
      case 'processing':
        return 'bg-warning text-warning-foreground';
      case 'denied':
      case 'failed':
      case 'cancelled':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const handleDeleteUser = (userId: string) => {
    dispatch(deleteUser(userId));
    toast({
      title: "User Deleted",
      description: "User has been removed from the system",
    });
  };

  const handleAddUser = () => {
    const newUser = {
      id: `user-${Date.now()}`,
      email: 'new.user@email.com',
      name: 'New User',
      role: 'customer' as const,
    };
    
    dispatch(addUser(newUser));
    toast({
      title: "User Added",
      description: "New user has been created successfully",
    });
  };

  // Analytics data
  const totalPremiums = policies.reduce((sum, p) => sum + p.premium, 0);
  const totalClaims = claims.reduce((sum, c) => sum + c.amount, 0);
  const totalPayments = payments.reduce((sum, p) => sum + p.amount, 0);

  const policyByType = policies.reduce((acc, policy) => {
    acc[policy.type] = (acc[policy.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const claimsByStatus = claims.reduce((acc, claim) => {
    acc[claim.status] = (acc[claim.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary text-white p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Administrator Dashboard</h1>
          <p className="text-white/80">System overview and management</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
            <Input
              placeholder="Search users, policies, claims..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">{users.length}</p>
                  <p className="text-xs text-muted-foreground">
                    {users.filter(u => u.role === 'customer').length} customers, {users.filter(u => u.role === 'agent').length} agents
                  </p>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Policies</p>
                  <p className="text-2xl font-bold">{policies.length}</p>
                  <p className="text-xs text-muted-foreground">
                    {policies.filter(p => p.status === 'active').length} active
                  </p>
                </div>
                <Shield className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Claims</p>
                  <p className="text-2xl font-bold">{claims.length}</p>
                  <p className="text-xs text-muted-foreground">
                    ${totalClaims.toLocaleString()} total value
                  </p>
                </div>
                <FileText className="w-8 h-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <p className="text-2xl font-bold">${totalPremiums.toLocaleString()}</p>
                  <p className="text-xs text-success flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +12% this quarter
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-success" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Policies by Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(policyByType).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="capitalize">{type}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${(count / policies.length) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Claims Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(claimsByStatus).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(status)} variant="secondary">
                        {status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${(count / claims.length) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="policies">All Policies</TabsTrigger>
            <TabsTrigger value="claims">All Claims</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">System Users</h3>
              <Button onClick={handleAddUser}>
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </div>
            
            <div className="grid gap-4">
              {filteredUsers.map((userItem) => (
                <Card key={userItem.id} className="shadow-card">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-semibold">{userItem.name}</p>
                          <p className="text-sm text-muted-foreground">{userItem.email}</p>
                        </div>
                        <Badge className={getStatusColor('active')}>
                          {userItem.role}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteUser(userItem.id)}
                          disabled={userItem.id === user?.id}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="policies" className="space-y-6">
            <h3 className="text-lg font-semibold">All Policies</h3>
            
            <div className="grid gap-4">
              {filteredPolicies.map((policy) => (
                <Card key={policy.id} className="shadow-card">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold capitalize">{policy.type} - {policy.number}</p>
                          <Badge className={getStatusColor(policy.status)}>
                            {policy.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {policy.customerName} | Agent: {policy.agentName}
                        </p>
                        <p className="text-sm">
                          Premium: ${policy.premium} | Coverage: ${policy.coverage.toLocaleString()}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        <FileText className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="claims" className="space-y-6">
            <h3 className="text-lg font-semibold">All Claims</h3>
            
            <div className="grid gap-4">
              {filteredClaims.map((claim) => (
                <Card key={claim.id} className="shadow-card">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold">Claim #{claim.id}</p>
                          <Badge className={getStatusColor(claim.status)}>
                            {claim.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {claim.customerName} | {claim.policyNumber}
                        </p>
                        <p className="text-sm">{claim.description}</p>
                        <p className="text-sm font-medium">
                          Amount: ${claim.amount.toLocaleString()} | 
                          Submitted: {new Date(claim.dateSubmitted).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        <FileText className="w-4 h-4 mr-2" />
                        Review
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;