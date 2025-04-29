
import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  Package,
  Users,
  ShoppingCart,
  RefreshCw,
  BarChart,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const SidebarItem = ({ 
  to, 
  icon: Icon, 
  label, 
  closeMobileNav 
}: { 
  to: string;
  icon: React.ElementType;
  label: string;
  closeMobileNav: () => void;
}) => {
  return (
    <NavLink
      to={to}
      onClick={closeMobileNav}
      className={({ isActive }) => cn(
        'flex items-center gap-3 px-3 py-2 rounded-md transition-colors',
        isActive 
          ? 'bg-sage-700 text-white' 
          : 'text-sage-100 hover:bg-sage-700/50'
      )}
    >
      <Icon size={20} />
      <span>{label}</span>
    </NavLink>
  );
};

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const closeMobileNav = () => setMobileNavOpen(false);

  const navItems = [
    { to: '/admin', icon: BarChart, label: 'Dashboard' },
    { to: '/admin/products', icon: Package, label: 'Products' },
    { to: '/admin/customers', icon: Users, label: 'Customers' },
    { to: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
    { to: '/admin/returns', icon: RefreshCw, label: 'Returns' },
    { to: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Sidebar Toggle */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-18 left-4 z-50 md:hidden"
        onClick={() => setMobileNavOpen(!mobileNavOpen)}
      >
        {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
      </Button>

      {/* Sidebar for desktop */}
      <aside className="hidden md:flex w-64 flex-col bg-sage-800 text-white">
        <div className="p-4 border-b border-sage-700">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <SidebarItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              closeMobileNav={closeMobileNav}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-sage-700">
          <Button
            variant="ghost"
            className="w-full justify-start text-sage-100 hover:text-white hover:bg-sage-700/50"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={closeMobileNav}></div>
          <aside className="fixed top-0 left-0 bottom-0 w-64 bg-sage-800 text-white z-50">
            <div className="p-4 border-b border-sage-700">
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
            </div>

            <nav className="p-4 space-y-2">
              {navItems.map((item) => (
                <SidebarItem
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                  label={item.label}
                  closeMobileNav={closeMobileNav}
                />
              ))}
            </nav>

            <div className="p-4 border-t border-sage-700">
              <Button
                variant="ghost"
                className="w-full justify-start text-sage-100 hover:text-white hover:bg-sage-700/50"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 mt-16 md:mt-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
