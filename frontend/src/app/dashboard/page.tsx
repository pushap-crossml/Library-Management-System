'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { dashboardAPI, authAPI } from '@/lib/api';
import { DashboardStats, User } from '@/lib/types';
import toast from 'react-hot-toast';
import {
  BookOpen,
  Users,
  BookMarked,
  BookCheck,
  AlertCircle,
  Clock,
  LogOut,
  Search,
  Menu,
  X
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      const [statsRes, userRes] = await Promise.all([
        dashboardAPI.getStats(),
        authAPI.getCurrentUser(),
      ]);
      setStats(statsRes.data);
      setUser(userRes.data);
    } catch {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    toast.success('Logged out successfully');
    router.push('/login');
  };

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className={`bg-blue-200 rounded-xl shadow-md p-6 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color.replace('border', 'bg').replace('600', '100')}`}>
          <Icon className={`h-8 w-8 ${color.replace('border', 'text')}`} />
        </div>
      </div>
    </div>
  );

  /* 🔹 SIDEBAR NAVIGATION (Reservations ADDED HERE) */
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: BookOpen },
    { name: 'Books', href: '/dashboard/books', icon: BookMarked },
    { name: 'Reservations', href: '/dashboard/reservations', icon: Clock },
    { name: 'Issue/Return', href: '/dashboard/issue', icon: BookCheck },
    { name: 'My Issues', href: '/dashboard/my-issues', icon: Clock },
    { name: 'Search', href: '/dashboard/search', icon: Search },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-30 w-64 shadow-lg transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 bg-[linear-gradient(135deg,#FCF9EA,#9CCFFF)]
        `}
      >
        <div className="flex items-center justify-between h-16 px-6">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-primary-600" />
            <span className="ml-2 text-xl font-bold text-gray-900 animate-bounce">Axis Library</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center px-3 py-3 mb-1 text-gray-700 rounded-lg hover:bg-sky-200 transition-colors"
            >
              <item.icon className="h-5 w-5" />
              <span className="ml-3 font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4">
          <div className="flex items-center px-3 py-2 mb-2 rounded-lg">
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-900">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-red-600 rounded-lg"
          >
            <LogOut className="h-5 w-5" />
            <span className="ml-3 font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="lg:pl-64">
        <header className="shadow-lg border-b text-black">
          <div className="flex items-center justify-between h-16 px-6">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
              <Menu className="h-6 w-6 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <span className="font-bold text-gray-600">
              Welcome, {user?.username}!
            </span>
          </div>
        </header>

        <main className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatCard title="Total Books" value={stats?.total_books || 0} icon={BookOpen} color="border-blue-600" />
            <StatCard title="Total Members" value={stats?.total_members || 0} icon={Users} color="border-green-600" />
            <StatCard title="Books Issued" value={stats?.books_issued || 0} icon={BookMarked} color="border-purple-600" />
            <StatCard title="Books Available" value={stats?.books_available || 0} icon={BookCheck} color="border-indigo-600" />
            <StatCard title="Overdue Books" value={stats?.overdue_books || 0} icon={AlertCircle} color="border-red-600" />
            <StatCard title="Pending Reservations" value={stats?.pending_reservations || 0} icon={Clock} color="border-yellow-600" />
          </div>
        

              {/* User Info Card */}
          <div className="bg-blue-200 rounded-xl shadow-md p-6 ">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Your Account</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Member Type</p>
                <p className="font-medium text-gray-900 capitalize">{user?.member_type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Books Issued</p>
                <p className="font-medium text-gray-900">
                  {user?.currently_issued_books} / {user?.max_books_allowed}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium text-gray-900">{user?.phone || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="font-medium text-gray-900">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/dashboard/books"
                className="bg-blue-200 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4 border-blue-600"
              >
                <BookOpen className="h-8 w-8 text-blue-600 mb-2" />
                <h3 className="font-bold text-gray-900">Browse Books</h3>
                <p className="text-sm text-gray-600 mt-1">Search and explore our collection</p>
              </Link>
              <Link
                href="/dashboard/my-issues"
                className="bg-blue-200 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4 border-purple-600"
              >
                <Clock className="h-8 w-8 text-purple-600 mb-2" />
                <h3 className="font-bold text-gray-900">My Issues</h3>
                <p className="text-sm text-gray-600 mt-1">View your borrowed books</p>
              </Link>
              <Link
                href="/dashboard/search"
                className="bg-blue-200 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4 border-green-600"
              >
                <Search className="h-8 w-8 text-green-600 mb-2" />
                <h3 className="font-bold text-gray-900">Search</h3>
                <p className="text-sm text-gray-600 mt-1">Find books by title, author, ISBN</p>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
