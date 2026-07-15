import React, { useState, useEffect } from 'react';
import { DashboardOverview } from './components/DashboardOverview';
import { InstituteList } from './components/InstituteList';
import { ReportSection } from './components/ReportSection';
import { SubscriptionManagement } from './components/SubscriptionManagement';
// import { UserManagement } from './components/UserManagement';
// import { Settings } from './components/Settings';
import { 
  LayoutDashboard, 
  Building2, 
  FileText, 
  CreditCard, 
  Users, 
  // Settings as SettingsIcon,
  Menu,
  X
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'institutes', label: 'Institutes', icon: Building2 },
    { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
    { id: 'reports', label: 'Reports', icon: FileText },
    // { id: 'users', label: 'User Management', icon: Users },
    // { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">Super Admin</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-4 ml-auto">
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Admin User</p>
                {/* <p className="text-xs text-gray-500">admin@dashboard.com</p> */}
              </div>
              
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                A
              </div>
{/* will remove this div in future */}

            <div>
              <button style={{cursor:'pointer',backgroundColor:"black",color:"white"}} onClick={()=>{
                   window.location.href="https://institute-admin-dashboard.vercel.app/"
              }}>Move To Institute Admin</button>
            </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && <DashboardOverview />}
          {activeTab === 'institutes' && <InstituteList />}
          {activeTab === 'subscriptions' && <SubscriptionManagement />}
          {activeTab === 'reports' && <ReportSection />}
          {/* {activeTab === 'users' && <UserManagement />} */}
          {/* {activeTab === 'settings' && <Settings />} */}
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
