import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { setPolicies, addPolicy } from '../store/slices/policiesSlice';
import { setClaims, updateClaim } from '../store/slices/claimsSlice';
import { setUsers } from '../store/slices/usersSlice';
import { mockPolicies, mockClaims, mockUsers } from '../data/mockData';
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
  Plus,
  Search, 
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const AgentDashboard = () => {
  const { user } = useAppSelector(state => state.auth);
  const { policies } = useAppSelector(state => state.policies);
  const { claims } = useAppSelector(state => state.claims);
  const { users } = useAppSelector(state => state.users);
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Load agent's assigned data
    const agentPolicies = mockPolicies.filter(p => p.agentId === user?.id);
    const agentClaims = mockClaims.filter(c => c.agentId === user?.id);
    const agentCustomers = mockUsers.filter(u => u.agentId === user?.id);
    
    dispatch(setPolicies(agentPolicies));
    dispatch(setClaims(agentClaims));
    dispatch(setUsers(agentCustomers));
  }, [dispatch, user?.id]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'completed':
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'pending':
      case 'processing':
        return <Clock className="w-4 h-4 text-warning" />;
      case 'denied':
      case 'failed':
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-destructive" />;
      default:
        return <AlertCircle className="w-4 h-4 text-muted-foreground" />;
    }
  };

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

  const handleClaimAction = (claimId: string, newStatus: string) => {
    const claim = claims.find(c => c.id === claimId);
    if (claim) {
      const updatedClaim = {
        ...claim,
        status: newStatus as any,
        dateProcessed: new Date().toISOString().split('T')[0],
      };
      dispatch(updateClaim(updatedClaim));
      toast({
        title: "Claim Updated",
        description: `Claim ${claimId} has been ${newStatus}`,
      });
    }
  };

  const handleCreatePolicy = () => {
    const newPolicy = {
      id: `pol-${Date.now()}`,
      customerId: users[0]?.id || '1',
      customerName: users[0]?.name || 'New Customer',
      type: 'auto' as const,
      number: `AUTO-${Date.now()}`,
      status: 'pending' as const,
      premium: 1000,
      coverage: 100000,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      agentId: user?.id || '',
      agentName: user?.name || '',
      documents: [],
    };
    
    dispatch(addPolicy(newPolicy));
    toast({
      title: "Policy Created",
      description: "New policy has been created successfully",
    });
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary text-white p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Agent Dashboard</h1>
          <p className="text-white/80">Manage your customers, policies, and claims</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
            <Input
              placeholder="Search customers, policies, claims..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">My Customers</p>
                  <p className="text-2xl font-bold">{users.length}</p>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Policies</p>
                  <p className="text-2xl font-bold">{policies.filter(p => p.status === 'active').length}</p>
                </div>
                <Shield className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Claims</p>
                  <p className="text-2xl font-bold">{claims.filter(c => c.status === 'pending' || c.status === 'processing').length}</p>
                </div>
                <FileText className="w-8 h-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Premium</p>
                  <p className="text-2xl font-bold">
                    ${policies.reduce((sum, p) => sum + p.premium, 0).toLocaleString()}
                  </p>
                </div>
                <Shield className="w-8 h-8 text-success" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="customers" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="customers">My Customers</TabsTrigger>
            <TabsTrigger value="policies">Policies</TabsTrigger>
            <TabsTrigger value="claims">Claims to Process</TabsTrigger>
          </TabsList>

          <TabsContent value="customers" className="space-y-6">
            <div className="grid gap-6">
              {filteredCustomers.map((customer) => {
                const customerPolicies = policies.filter(p => p.customerId === customer.id);
                const customerClaims = claims.filter(c => c.customerId === customer.id);
                
                return (
                  <Card key={customer.id} className="shadow-card">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>{customer.name}</CardTitle>
                          <CardDescription>{customer.email}</CardDescription>
                        </div>
                        <Button variant="outline" size="sm">
                          View Profile
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Active Policies</p>
                          <p className="font-semibold">{customerPolicies.filter(p => p.status === 'active').length}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Open Claims</p>
                          <p className="font-semibold">{customerClaims.filter(c => c.status === 'pending' || c.status === 'processing').length}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total Premium</p>
                          <p className="font-semibold">
                            ${customerPolicies.reduce((sum, p) => sum + p.premium, 0).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="policies" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Customer Policies</h3>
              <Button onClick={handleCreatePolicy}>
                <Plus className="w-4 h-4 mr-2" />
                Create Policy
              </Button>
            </div>
            
            <div className="grid gap-6">
              {filteredPolicies.map((policy) => (
                <Card key={policy.id} className="shadow-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="capitalize">{policy.type} Insurance</CardTitle>
                        <CardDescription>
                          {policy.customerName} - Policy #{policy.number}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(policy.status)}
                        <Badge className={getStatusColor(policy.status)}>
                          {policy.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Premium</p>
                        <p className="font-semibold">${policy.premium}/year</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Coverage</p>
                        <p className="font-semibold">${policy.coverage.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Start Date</p>
                        <p className="font-semibold">{new Date(policy.startDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">End Date</p>
                        <p className="font-semibold">{new Date(policy.endDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button variant="outline" size="sm">
                        <FileText className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        Edit Policy
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="claims" className="space-y-6">
            <h3 className="text-lg font-semibold">Claims Requiring Action</h3>
            
            <div className="grid gap-6">
              {filteredClaims
                .filter(claim => claim.status === 'pending' || claim.status === 'processing')
                .map((claim) => (
                <Card key={claim.id} className="shadow-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Claim #{claim.id}</CardTitle>
                        <CardDescription>
                          {claim.customerName} - {claim.policyNumber}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(claim.status)}
                        <Badge className={getStatusColor(claim.status)}>
                          {claim.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm">{claim.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Amount</p>
                          <p className="font-semibold">${claim.amount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Type</p>
                          <p className="font-semibold capitalize">{claim.type}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Submitted</p>
                          <p className="font-semibold">{new Date(claim.dateSubmitted).toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleClaimAction(claim.id, 'approved')}
                          className="bg-success hover:bg-success/90"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleClaimAction(claim.id, 'denied')}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Deny
                        </Button>
                        <Button variant="outline" size="sm">
                          <FileText className="w-4 h-4 mr-2" />
                          View Documents
                        </Button>
                      </div>
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

export default AgentDashboard;