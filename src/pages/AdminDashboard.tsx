import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Calendar, Clock, CheckCircle2, User, Phone, MapPin, MoreHorizontal, Plus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Logo } from '../components/common/Logo';

// Mock data to represent incoming form submissions
const MOCK_BOOKINGS = [
  {
    id: 'B-1001',
    name: 'Sarah Jenkins',
    phone: '0412 345 678',
    address: '42 Example Street, Sunnybank',
    service: 'Full Residential',
    date: '2026-04-10',
    status: 'pending',
    notes: 'Please watch out for the dog gate on the left side.',
    createdAt: '2026-04-06T10:30:00',
  },
  {
    id: 'B-1002',
    name: 'Michael Chen',
    phone: '0488 999 111',
    address: '15 Leafy Avenue, Springwood',
    service: 'The Clean Up',
    date: '2026-04-12',
    status: 'confirmed',
    notes: 'Grass is about knee-high in the back.',
    createdAt: '2026-04-05T14:15:00',
  },
  {
    id: 'B-1003',
    name: 'Emma Watson',
    phone: '0422 123 456',
    address: '88 River Road, Fig Tree Pocket',
    service: 'The Quick Trim',
    date: '2026-04-08',
    status: 'completed',
    notes: '',
    createdAt: '2026-04-01T09:00:00',
  },
];

export function AdminDashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);

  // Simple auth check
  useEffect(() => {
    const isAdmin = sessionStorage.getItem('isAdmin');
    if (!isAdmin) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('isAdmin');
    navigate('/admin');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pending</Badge>;
      case 'confirmed':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Confirmed</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-brand-50 text-brand-700 border-brand-200">Completed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Admin Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="container px-4 mx-auto h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo />
            <div className="h-6 w-px bg-slate-200 hidden md:block"></div>
            <span className="text-sm font-medium text-slate-500 hidden md:block">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="hidden sm:flex">
              View Live Site
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout} className="text-slate-600">
              <LogOut className="w-4 h-4 mr-2" />
              Log Out
            </Button>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="flex-grow container px-4 mx-auto py-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Service Requests</h1>
            <p className="text-sm text-slate-500 mt-1">Manage your incoming leads and schedule.</p>
          </div>
          <Button className="bg-brand-600 hover:bg-brand-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            New Booking
          </Button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Pending Requests</p>
                <h3 className="text-2xl font-bold text-slate-900">
                  {bookings.filter(b => b.status === 'pending').length}
                </h3>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Upcoming Jobs</p>
                <h3 className="text-2xl font-bold text-slate-900">
                  {bookings.filter(b => b.status === 'confirmed').length}
                </h3>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-6 h-6 text-brand-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Completed</p>
                <h3 className="text-2xl font-bold text-slate-900">
                  {bookings.filter(b => b.status === 'completed').length}
                </h3>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bookings Table Area */}
        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Contact & Location</th>
                  <th className="px-6 py-4 font-medium">Service Requested</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-slate-500" />
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{booking.name}</div>
                          <div className="text-xs text-slate-500">ID: {booking.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          {booking.phone}
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate max-w-[200px]">{booking.address}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{booking.service}</div>
                      {booking.notes && (
                        <div className="text-xs text-slate-500 truncate max-w-[200px] mt-1" title={booking.notes}>
                          Note: {booking.notes}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(booking.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-900">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
                
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      No bookings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

      </main>
    </div>
  );
}