import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { setPolicies } from '../store/slices/policiesSlice';
import { setClaims } from '../store/slices/claimsSlice';
import { setPayments } from '../store/slices/paymentsSlice';
import { mockPolicies, mockClaims, mockPayments } from '../data/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
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

const CustomerDashboard = () => {
  const { user } = useAppSelector(state => state.auth);
  const { policies } = useAppSelector(state => state.policies);
  const { claims } = useAppSelector(state => state.claims);
  const { payments } = useAppSelector(state => state.payments);
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Load customer's data
    const customerPolicies = mockPolicies.filter(p => p.customerId === user?.id);
    const customerClaims = mockClaims.filter(c => c.customerId === user?.id);
    const customerPayments = mockPayments.filter(p => p.customerId === user?.id);
    
    dispatch(setPolicies(customerPolicies));
    dispatch(setClaims(customerClaims));
    dispatch(setPayments(customerPayments));
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary text-white p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-white/80">Manage your policies, claims, and payments</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
            <Input
              placeholder="Search policies, claims..."
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
                  <p className="text-sm text-muted-foreground">Open Claims</p>
                  <p className="text-2xl font-bold">{claims.filter(c => c.status === 'pending' || c.status === 'processing').length}</p>
                </div>
                <FileText className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Payments</p>
                  <p className="text-2xl font-bold">{payments.filter(p => p.status === 'pending').length}</p>
                </div>
                <DollarSign className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Coverage</p>
                  <p className="text-2xl font-bold">
                    ${policies.reduce((sum, p) => sum + p.coverage, 0).toLocaleString()}
                  </p>
                </div>
                <Shield className="w-8 h-8 text-success" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="policies" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="policies">My Policies</TabsTrigger>
            <TabsTrigger value="claims">My Claims</TabsTrigger>
            <TabsTrigger value="payments">Payment History</TabsTrigger>
          </TabsList>

          <TabsContent value="policies" className="space-y-6">
            <div className="grid gap-6">
              {filteredPolicies.map((policy) => (
                <Card key={policy.id} className="shadow-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="capitalize">{policy.type} Insurance</CardTitle>
                        <CardDescription>Policy #{policy.number}</CardDescription>
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Premium</p>
                        <p className="font-semibold">${policy.premium}/year</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Coverage</p>
                        <p className="font-semibold">${policy.coverage.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Agent</p>
                        <p className="font-semibold">{policy.agentName}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button variant="outline" size="sm">
                        <FileText className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Document
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="claims" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">My Claims</h3>
              <Button>
                <FileText className="w-4 h-4 mr-2" />
                File New Claim
              </Button>
            </div>
            
            <div className="grid gap-6">
              {filteredClaims.map((claim) => (
                <Card key={claim.id} className="shadow-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Claim #{claim.id}</CardTitle>
                        <CardDescription>{claim.description}</CardDescription>
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Policy</p>
                        <p className="font-semibold">{claim.policyNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Amount</p>
                        <p className="font-semibold">${claim.amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Submitted</p>
                        <p className="font-semibold">{new Date(claim.dateSubmitted).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button variant="outline" size="sm">
                        <FileText className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Document
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Payment History</h3>
              <Button>
                <DollarSign className="w-4 h-4 mr-2" />
                Make Payment
              </Button>
            </div>
            
            <div className="grid gap-4">
              {filteredPayments.map((payment) => (
                <Card key={payment.id} className="shadow-card">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(payment.status)}
                          <Badge className={getStatusColor(payment.status)}>
                            {payment.status}
                          </Badge>
                        </div>
                        <div>
                          <p className="font-semibold">${payment.amount}</p>
                          <p className="text-sm text-muted-foreground">
                            {payment.type} - {payment.policyNumber}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">{payment.method.replace('_', ' ')}</p>
                        <p className="text-sm">{new Date(payment.date).toLocaleDateString()}</p>
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

export default CustomerDashboard;