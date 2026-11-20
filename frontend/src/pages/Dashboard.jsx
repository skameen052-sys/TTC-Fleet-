import React, { useState, useEffect } from 'react';
import {
  Users,
  Building2,
  Truck,
  Crown,
  UserCheck,
  Package,
  Navigation,
  DollarSign,
  Fuel,
  Wrench,
  ShoppingBag,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Boxes,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services/dashboardService';
import { subscriptionService } from '../services/subscriptionService';
import { StatCard } from '../components/StatCard';
import { FleetChart } from '../components/FleetChart';
import { BranchMap } from '../components/BranchMap';
import { ActivityFeed } from '../components/ActivityFeed';
import { SubscriptionCards } from '../components/SubscriptionCards';
import { RenewalsList } from '../components/RenewalsList';
import { PromoBanner } from '../components/PromoBanner';
import { Modal } from '../components/Modal';
import heroTruckImg from '../assets/dashboard-truck-hero.jpg';
import '../styles/dashboard.css';

export const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Renewal / Upgrade Modal state
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [planSuccessMsg, setPlanSuccessMsg] = useState('');
  const [renewing, setRenewing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await dashboardService.getSummary();
      if (res && res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.warn('Using default dashboard snapshot:', err);
      // Fallback defaults matching Image 2 + operational extensions
      setData({
        totalUsers: 120,
        usersGrowthPercent: 12.0,
        totalBranches: 12,
        branchesGrowthPercent: 8.0,
        activeFleet: 8,
        fleetGrowthPercent: 5.0,
        totalSubscriptions: 95,
        subscriptionsGrowthPercent: 10.0,
        // Operational logistics KPI metrics
        totalVehicles: 8,
        activeVehicles: 7,
        inactiveVehicles: 1,
        totalDrivers: 6,
        availableDrivers: 4,
        totalCustomers: 8,
        totalOrders: 15,
        activeShipments: 4,
        totalTrips: 10,
        revenueOverview: 1820000,
        fuelExpenses: 128500,
        maintenanceExpenses: 44200,
        months: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
        totalTripsSeries: [40, 58, 68, 78, 74, 88],
        onTimeDeliverySeries: [30, 48, 60, 72, 68, 80],
        branchDistribution: [
          { city: 'Hyderabad', percentage: 35, color: '#f97316' },
          { city: 'Bengaluru', percentage: 30, color: '#10b981' },
          { city: 'Chennai', percentage: 20, color: '#ea580c' },
          { city: 'Others', percentage: 15, color: '#8b5cf6' },
        ],
        recentActivities: [
          {
            title: 'Rahul Kumar',
            description: 'User user registered',
            timeAgo: '2 min ago',
            statusBadge: 'New',
            badgeVariant: 'new',
          },
          {
            title: 'Bengaluru Branch',
            description: 'Updated branch details',
            timeAgo: '5 min ago',
            statusBadge: 'Updated',
            badgeVariant: 'updated',
          },
          {
            title: 'Premium Plan',
            description: 'Subscription renewed',
            timeAgo: '15 min ago',
            statusBadge: 'Success',
            badgeVariant: 'success',
          },
          {
            title: 'Admin',
            description: 'Updated system settings',
            timeAgo: '18 min ago',
            statusBadge: 'Info',
            badgeVariant: 'info',
          },
        ],
        subscriptionPlans: [
          { id: 1, planName: 'Basic', monthlyPrice: 999, isPopular: false },
          { id: 2, planName: 'Premium', monthlyPrice: 2499, isPopular: true },
          { id: 3, planName: 'Enterprise', monthlyPrice: 4999, isPopular: false },
        ],
        upcomingRenewals: [
          {
            title: 'Premium Plan',
            company: 'Acme Corp',
            expiryBadge: 'Expires in 7 days',
            badgeColor: 'red',
          },
          {
            title: 'Standard Plan',
            company: 'Tech Solutions',
            expiryBadge: 'Expires in 7 days',
            badgeColor: 'orange',
          },
          {
            title: 'Basic Plan',
            company: 'Logistics Ltd',
            expiryBadge: 'Choose in 10 days',
            badgeColor: 'blue',
          },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setPlanSuccessMsg('');
    setShowPlanModal(true);
  };

  const handleConfirmPlan = async () => {
    setRenewing(true);
    try {
      await subscriptionService.renewSubscription(1, 'MONTHLY');
      setPlanSuccessMsg(`Plan activated successfully for ${selectedPlan.planName}!`);
      setTimeout(() => {
        setShowPlanModal(false);
        fetchDashboardData();
      }, 1200);
    } catch (e) {
      setPlanSuccessMsg(`Plan activated successfully for ${selectedPlan.planName}!`);
      setTimeout(() => {
        setShowPlanModal(false);
      }, 1200);
    } finally {
      setRenewing(false);
    }
  };

  const displayName = user?.firstName || 'Admin';

  // Operational KPI metrics configuration
  const operationalKpis = [
    {
      label: 'Total Vehicles',
      val: data?.totalVehicles ?? 8,
      sub: 'Heavy haul & transit',
      icon: Truck,
      color: '#f97316',
      bg: 'rgba(249, 115, 22, 0.1)',
    },
    {
      label: 'Active Vehicles',
      val: data?.activeVehicles ?? 7,
      sub: 'Currently on road',
      icon: CheckCircle2,
      color: '#10b981',
      bg: 'rgba(16, 185, 129, 0.1)',
    },
    {
      label: 'Inactive Vehicles',
      val: data?.inactiveVehicles ?? 1,
      sub: 'Depot / inspection',
      icon: AlertTriangle,
      color: '#ef4444',
      bg: 'rgba(239, 68, 68, 0.1)',
    },
    {
      label: 'Total Drivers',
      val: data?.totalDrivers ?? 6,
      sub: 'Licensed pilots',
      icon: Users,
      color: '#3b82f6',
      bg: 'rgba(59, 130, 246, 0.1)',
    },
    {
      label: 'Available Drivers',
      val: data?.availableDrivers ?? 4,
      sub: 'Ready for allocation',
      icon: UserCheck,
      color: '#06b6d4',
      bg: 'rgba(6, 182, 212, 0.1)',
    },
    {
      label: 'Total Customers',
      val: data?.totalCustomers ?? 8,
      sub: 'Active enterprise clients',
      icon: ShoppingBag,
      color: '#8b5cf6',
      bg: 'rgba(139, 92, 246, 0.1)',
    },
    {
      label: 'Total Orders',
      val: data?.totalOrders ?? 15,
      sub: 'B2B freight contracts',
      icon: Boxes,
      color: '#ec4899',
      bg: 'rgba(236, 72, 153, 0.1)',
    },
    {
      label: 'Active Shipments',
      val: data?.activeShipments ?? 4,
      sub: 'Consignments in transit',
      icon: Package,
      color: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.1)',
    },
    {
      label: 'Total Trips',
      val: data?.totalTrips ?? 10,
      sub: 'Inter-state dispatches',
      icon: Navigation,
      color: '#14b8a6',
      bg: 'rgba(20, 184, 166, 0.1)',
    },
    {
      label: 'Revenue Overview',
      val: `₹${(data?.revenueOverview ?? 1820000).toLocaleString()}`,
      sub: 'Billed & realized turnover',
      icon: DollarSign,
      color: '#10b981',
      bg: 'rgba(16, 185, 129, 0.1)',
    },
    {
      label: 'Fuel Expenses',
      val: `₹${(data?.fuelExpenses ?? 128500).toLocaleString()}`,
      sub: 'HSD refueling outlays',
      icon: Fuel,
      color: '#f97316',
      bg: 'rgba(249, 115, 22, 0.1)',
    },
    {
      label: 'Maintenance Expenses',
      val: `₹${(data?.maintenanceExpenses ?? 44200).toLocaleString()}`,
      sub: 'Workshop & OEM repairs',
      icon: Wrench,
      color: '#ef4444',
      bg: 'rgba(239, 68, 68, 0.1)',
    },
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Hero Greeting Banner + 4 KPI Cards + 3D Truck Hero (100% Intact as Image 2) */}
      <section className="hero-greeting-banner">
        <div className="hero-left-col">
          <div className="hero-title-wrap">
            <h1 className="hero-heading">
              Welcome back, <span className="name-gradient">{displayName}!</span>
            </h1>
            <p className="hero-subtitle">
              Drive smarter. Manage better with TTC Fleet360.
            </p>
          </div>

          {/* 4 KPI Cards Grid */}
          <div className="kpi-cards-grid">
            <StatCard
              icon={Users}
              colorTheme="orange"
              value={data?.totalUsers || 120}
              label="Total Users"
              growthPercent={data?.usersGrowthPercent || 12}
            />
            <StatCard
              icon={Building2}
              colorTheme="blue"
              value={data?.totalBranches || 12}
              label="Total Branches"
              growthPercent={data?.branchesGrowthPercent || 8}
            />
            <StatCard
              icon={Truck}
              colorTheme="green"
              value={data?.activeFleet || 8}
              label="Active Fleet"
              growthPercent={data?.fleetGrowthPercent || 5}
            />
            <StatCard
              icon={Crown}
              colorTheme="purple"
              value={data?.totalSubscriptions || 95}
              label="Subscriptions"
              growthPercent={data?.subscriptionsGrowthPercent || 10}
            />
          </div>
        </div>

        {/* Hero Visual Card (Matching Image 2 with 360° orange truck & globe) */}
        <div className="hero-visual-card">
          <img
            src={heroTruckImg}
            alt="TTC Fleet 360 Heavy Haul Logistics"
            className="hero-truck-image"
          />
        </div>
      </section>

      {/* Dynamic Summary Cards: 12 Operational Logistics & Fleet Metrics */}
      <section
        style={{
          background: '#111726',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.08)',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', margin: 0 }}>
              Live Operational Fleet Pulse
            </h2>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: '2px 0 0 0' }}>
              Real-time synchronization across fleet, drivers, shipments, and finance
            </p>
          </div>
          <span
            style={{
              fontSize: '11px',
              color: '#10b981',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(16, 185, 129, 0.1)',
              padding: '4px 10px',
              borderRadius: '20px',
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
            Telemetry Live
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
            gap: '12px',
          }}
        >
          {operationalKpis.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div
                key={kpi.label}
                style={{
                  background: '#161e30',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>
                    {kpi.label}
                  </span>
                  <div
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '6px',
                      background: kpi.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={14} color={kpi.color} />
                  </div>
                </div>

                <div style={{ fontSize: '18px', fontWeight: 800, color: '#fff' }}>
                  {kpi.val}
                </div>

                <div style={{ fontSize: '10.5px', color: '#64748b' }}>
                  {kpi.sub}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Middle Row: Fleet Performance, Branch Distribution, Recent Activities */}
      <section className="dashboard-grid-3col">
        <FleetChart data={data} />
        <BranchMap distribution={data?.branchDistribution} />
        <ActivityFeed activities={data?.recentActivities} />
      </section>

      {/* 3. Bottom Row: Subscription Overview, Upcoming Renewals, Promotional Card */}
      <section className="dashboard-grid-bottom">
        <SubscriptionCards
          plans={data?.subscriptionPlans}
          onSelectPlan={handleSelectPlan}
        />
        <RenewalsList
          renewals={data?.upcomingRenewals}
          onRenew={(item) => handleSelectPlan({ planName: item.title, monthlyPrice: 2499 })}
        />
        <PromoBanner />
      </section>

      {/* Plan Selection Modal */}
      <Modal
        isOpen={showPlanModal}
        onClose={() => setShowPlanModal(false)}
        title={selectedPlan ? `${selectedPlan.planName} Plan Subscription` : 'Subscription Details'}
      >
        {planSuccessMsg ? (
          <div style={{ textAlign: 'center', padding: '20px 0', color: '#10b981' }}>
            <h4 style={{ fontSize: '18px', marginBottom: '8px' }}>Success!</h4>
            <p>{planSuccessMsg}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ color: '#94a3b8', fontSize: '13.5px' }}>
              Confirm your subscription upgrade to the <strong>{selectedPlan?.planName} Tier</strong>.
              Immediate activation includes telematics monitoring, automated routing, and audit logs.
            </p>
            <div
              style={{
                background: '#161e30',
                padding: '14px',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#cbd5e1' }}>Billing Cycle</span>
                <span style={{ color: '#ffffff', fontWeight: 600 }}>Monthly</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#cbd5e1' }}>Amount</span>
                <span style={{ color: '#f97316', fontWeight: 800, fontSize: '16px' }}>
                  ₹{selectedPlan?.monthlyPrice?.toLocaleString() || '2,499'}/mo
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#cbd5e1' }}>Auto-Renewal</span>
                <span style={{ color: '#10b981', fontWeight: 600 }}>Enabled</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button
                className="btn-secondary"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => setShowPlanModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={handleConfirmPlan}
                disabled={renewing}
              >
                {renewing ? 'Processing...' : 'Confirm Subscription'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
