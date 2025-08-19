import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, MapPin, Users, CreditCard, Settings, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    navigate('/');
  };

  const menuItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/trips', icon: MapPin, label: 'Viagens' },
    { path: '/admin/passengers', icon: Users, label: 'Passageiros' },
    { path: '/admin/payments', icon: CreditCard, label: 'Pagamentos' },
    { path: '/admin/settings', icon: Settings, label: 'Configurações' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`bg-white shadow-lg transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'} lg:w-64`}>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <h2 className={`font-bold text-xl text-gray-800 ${sidebarOpen ? 'block' : 'hidden'} lg:block`}>
              Admin Panel
            </h2>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <nav className="mt-8">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center px-4 py-3 text-left hover:bg-blue-50 transition-colors ${
                  isActive(item.path) ? 'bg-blue-100 border-r-4 border-blue-600 text-blue-600' : 'text-gray-700'
                }`}
              >
                <Icon size={20} className="flex-shrink-0" />
                <span className={`ml-3 ${sidebarOpen ? 'block' : 'hidden'} lg:block`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={20} className="flex-shrink-0" />
            <span className={`ml-3 ${sidebarOpen ? 'block' : 'hidden'} lg:block`}>
              Sair
            </span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Organizador Admin</span>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">A</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;