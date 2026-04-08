import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LogOut,
  Calendar,
  Clock,
  CheckCircle2,
  User,
  Phone,
  MapPin,
  MoreHorizontal,
  Plus,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Logo } from '../components/common/Logo';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '../components/ui/dropdown-menu';
import { supabase, type Booking, type BookingStatus } from '../lib/supabase';
import {
  canDeleteBooking,
  canTransitionBookingStatus,
  getAllowedStatusTransitions,
  getServiceLabel,
  validateBookingInput,
} from '../lib/booking-rules';

type NewBookingForm = {
  name: string;
  phone: string;
  address: string;
  service: string;
  notes: string;
  status: BookingStatus;
};

const initialFormState: NewBookingForm = {
  name: '',
  phone: '',
  address: '',
  service: '',
  notes: '',
  status: 'pending',
};

const toBookingForm = (booking: Booking): NewBookingForm => ({
  name: booking.name,
  phone: booking.phone,
  address: booking.address,
  service: booking.service,
  notes: booking.notes ?? '',
  status: booking.status,
});

export function AdminDashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tableError, setTableError] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [newBooking, setNewBooking] = useState<NewBookingForm>(initialFormState);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editError, setEditError] = useState('');
  const [editingBookingId, setEditingBookingId] = useState<string | null>(null);
  const [editBooking, setEditBooking] = useState<NewBookingForm>(initialFormState);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [deletingBooking, setDeletingBooking] = useState<Booking | null>(null);
  const [actionBookingId, setActionBookingId] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      setTableError('');
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setBookings(data as Booking[]);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setTableError('Could not load bookings. Please refresh and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin', { replace: true });
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

  const handleCreateBooking = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCreateError('');
    setIsCreating(true);

    try {
      const validationErrors = validateBookingInput(newBooking);
      if (validationErrors.length > 0) {
        setCreateError(validationErrors[0]);
        setIsCreating(false);
        return;
      }

      const payload = {
        name: newBooking.name.trim(),
        phone: newBooking.phone.trim(),
        address: newBooking.address.trim(),
        service: newBooking.service,
        notes: newBooking.notes.trim() || null,
        status: newBooking.status,
      };

      const { error } = await supabase.from('bookings').insert([payload]);

      if (error) throw error;

      setIsCreateDialogOpen(false);
      setNewBooking(initialFormState);
      await fetchBookings();
    } catch (error) {
      console.error('Error creating booking:', error);
      const message =
        error instanceof Error
          ? error.message
          : typeof error === 'object' && error !== null && 'message' in error
            ? String((error as { message: unknown }).message)
            : 'Could not create the booking. Please check the fields and try again.';
      setCreateError(message);
    } finally {
      setIsCreating(false);
    }
  };

  const openEditDialog = (booking: Booking) => {
    setEditError('');
    setEditingBookingId(booking.id);
    setEditBooking(toBookingForm(booking));
    setIsEditDialogOpen(true);
  };

  const handleEditBooking = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!editingBookingId) {
      setEditError('No booking selected to edit.');
      return;
    }

    setEditError('');
    setIsEditing(true);

    try {
      const validationErrors = validateBookingInput(editBooking);
      if (validationErrors.length > 0) {
        setEditError(validationErrors[0]);
        setIsEditing(false);
        return;
      }

      const payload = {
        name: editBooking.name.trim(),
        phone: editBooking.phone.trim(),
        address: editBooking.address.trim(),
        service: editBooking.service,
        notes: editBooking.notes.trim() || null,
        status: editBooking.status,
      };

      const currentBooking = bookings.find((item) => item.id === editingBookingId);
      if (
        currentBooking &&
        !canTransitionBookingStatus(currentBooking.status, editBooking.status)
      ) {
        setEditError(
          `Cannot change booking status from ${currentBooking.status} to ${editBooking.status}.`
        );
        setIsEditing(false);
        return;
      }

      const { error } = await supabase
        .from('bookings')
        .update(payload)
        .eq('id', editingBookingId);

      if (error) throw error;

      setIsEditDialogOpen(false);
      setEditingBookingId(null);
      setEditBooking(initialFormState);
      await fetchBookings();
    } catch (error) {
      console.error('Error editing booking:', error);
      setEditError('Could not save the booking changes. Please try again.');
    } finally {
      setIsEditing(false);
    }
  };

  const handleUpdateStatus = async (bookingId: string, status: BookingStatus) => {
    try {
      const booking = bookings.find((item) => item.id === bookingId);
      if (!booking) {
        setTableError('Could not find the selected booking.');
        return;
      }

      if (!canTransitionBookingStatus(booking.status, status)) {
        setTableError(
          `Cannot change booking status from ${booking.status} to ${status}.`
        );
        return;
      }

      setTableError('');
      setActionBookingId(bookingId);
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId);

      if (error) throw error;
      await fetchBookings();
    } catch (error) {
      console.error('Error updating booking status:', error);
      setTableError('Could not update the booking status. Please try again.');
    } finally {
      setActionBookingId(null);
    }
  };

  const openDeleteDialog = (booking: Booking) => {
    if (!canDeleteBooking(booking.status)) {
      setTableError('Completed bookings cannot be deleted. Reopen them first if needed.');
      return;
    }

    setDeleteError('');
    setTableError('');
    setDeletingBooking(booking);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteBooking = async () => {
    if (!deletingBooking) {
      setDeleteError('No booking selected to delete.');
      return;
    }

    try {
      setIsDeleting(true);
      setActionBookingId(deletingBooking.id);
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', deletingBooking.id);

      if (error) throw error;

      setIsDeleteDialogOpen(false);
      setDeletingBooking(null);
      await fetchBookings();
    } catch (error) {
      console.error('Error deleting booking:', error);
      const message =
        error instanceof Error ? error.message : 'Could not delete the booking. Please try again.';
      setDeleteError(message);
    } finally {
      setIsDeleting(false);
      setActionBookingId(null);
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
          <Button
            className="bg-brand-600 hover:bg-brand-700 text-white"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Booking
          </Button>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Booking</DialogTitle>
              <DialogDescription>
                Add a booking manually and save it straight into your bookings dashboard.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateBooking} className="space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="admin-name">Customer Name</Label>
                  <Input
                    id="admin-name"
                    value={newBooking.name}
                    onChange={(e) =>
                      setNewBooking((current) => ({ ...current, name: e.target.value }))
                    }
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-phone">Phone Number</Label>
                  <Input
                    id="admin-phone"
                    value={newBooking.phone}
                    onChange={(e) =>
                      setNewBooking((current) => ({ ...current, phone: e.target.value }))
                    }
                    placeholder="0400 000 000"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-address">Property Address</Label>
                <Input
                  id="admin-address"
                  value={newBooking.address}
                  onChange={(e) =>
                    setNewBooking((current) => ({ ...current, address: e.target.value }))
                  }
                  placeholder="123 Example Street, Suburb"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="admin-service">Service</Label>
                  <Select
                    value={newBooking.service}
                    onValueChange={(value) =>
                      setNewBooking((current) => ({ ...current, service: value }))
                    }
                  >
                    <SelectTrigger id="admin-service" className="w-full">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quickTrim">The Quick Trim</SelectItem>
                      <SelectItem value="fullResidential">Full Residential</SelectItem>
                      <SelectItem value="cleanUp">The Clean Up</SelectItem>
                      <SelectItem value="other">Other / Not Sure</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admin-status">Status</Label>
                  <Select
                    value={newBooking.status}
                    onValueChange={(value) =>
                      setNewBooking((current) => ({
                        ...current,
                        status: value as BookingStatus,
                      }))
                    }
                  >
                    <SelectTrigger id="admin-status" className="w-full">
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-notes">Notes</Label>
                <Textarea
                  id="admin-notes"
                  value={newBooking.notes}
                  onChange={(e) =>
                    setNewBooking((current) => ({ ...current, notes: e.target.value }))
                  }
                  placeholder="Gate code, access notes, lawn condition, or schedule notes"
                  className="resize-none"
                  rows={4}
                />
              </div>

              {createError ? (
                <p className="text-sm text-red-600">{createError}</p>
              ) : null}

              <DialogFooter className="px-0 pb-0 pt-4 mx-0 mb-0 border-t-0 bg-transparent">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreateDialogOpen(false);
                    setCreateError('');
                  }}
                  disabled={isCreating}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-brand-600 hover:bg-brand-700 text-white"
                  disabled={
                    isCreating ||
                    !newBooking.name.trim() ||
                    !newBooking.phone.trim() ||
                    !newBooking.address.trim() ||
                    !newBooking.service
                  }
                >
                  {isCreating ? 'Saving...' : 'Save Booking'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog
          open={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) {
              setEditError('');
              setEditingBookingId(null);
              setEditBooking(initialFormState);
            }
          }}
        >
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Booking</DialogTitle>
              <DialogDescription>
                Update the customer details, selected service, notes, or current job status.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleEditBooking} className="space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Customer Name</Label>
                  <Input
                    id="edit-name"
                    value={editBooking.name}
                    onChange={(e) =>
                      setEditBooking((current) => ({ ...current, name: e.target.value }))
                    }
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Phone Number</Label>
                  <Input
                    id="edit-phone"
                    value={editBooking.phone}
                    onChange={(e) =>
                      setEditBooking((current) => ({ ...current, phone: e.target.value }))
                    }
                    placeholder="0400 000 000"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-address">Property Address</Label>
                <Input
                  id="edit-address"
                  value={editBooking.address}
                  onChange={(e) =>
                    setEditBooking((current) => ({ ...current, address: e.target.value }))
                  }
                  placeholder="123 Example Street, Suburb"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-service">Service</Label>
                  <Select
                    value={editBooking.service}
                    onValueChange={(value) =>
                      setEditBooking((current) => ({ ...current, service: value }))
                    }
                  >
                    <SelectTrigger id="edit-service" className="w-full">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quickTrim">The Quick Trim</SelectItem>
                      <SelectItem value="fullResidential">Full Residential</SelectItem>
                      <SelectItem value="cleanUp">The Clean Up</SelectItem>
                      <SelectItem value="other">Other / Not Sure</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={editBooking.status}
                    onValueChange={(value) =>
                      setEditBooking((current) => ({
                        ...current,
                        status: value as BookingStatus,
                      }))
                    }
                  >
                    <SelectTrigger id="edit-status" className="w-full">
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea
                  id="edit-notes"
                  value={editBooking.notes}
                  onChange={(e) =>
                    setEditBooking((current) => ({ ...current, notes: e.target.value }))
                  }
                  placeholder="Gate code, access notes, lawn condition, or schedule notes"
                  className="resize-none"
                  rows={4}
                />
              </div>

              {editError ? <p className="text-sm text-red-600">{editError}</p> : null}

              <DialogFooter className="px-0 pb-0 pt-4 mx-0 mb-0 border-t-0 bg-transparent">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setEditError('');
                    setEditingBookingId(null);
                    setEditBooking(initialFormState);
                  }}
                  disabled={isEditing}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-brand-600 hover:bg-brand-700 text-white"
                  disabled={
                    isEditing ||
                    !editBooking.name.trim() ||
                    !editBooking.phone.trim() ||
                    !editBooking.address.trim() ||
                    !editBooking.service
                  }
                >
                  {isEditing ? 'Saving...' : 'Save Changes'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog
          open={isDeleteDialogOpen}
          onOpenChange={(open) => {
            setIsDeleteDialogOpen(open);
            if (!open) {
              setDeleteError('');
              setDeletingBooking(null);
            }
          }}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Booking</DialogTitle>
              <DialogDescription>
                This will permanently remove this booking from your dashboard.
              </DialogDescription>
            </DialogHeader>

            <div className="rounded-xl border border-red-200 bg-red-50/70 p-4">
              <div className="text-sm font-medium text-slate-900">
                {deletingBooking?.name || 'Selected booking'}
              </div>
              <div className="mt-1 text-sm text-slate-600">
                {deletingBooking?.address || 'No address available'}
              </div>
              <div className="mt-2 text-xs text-red-700">
                This action cannot be undone.
              </div>
            </div>

            {deleteError ? <p className="text-sm text-red-600">{deleteError}</p> : null}

            <DialogFooter className="px-0 pb-0 pt-4 mx-0 mb-0 border-t-0 bg-transparent">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDeleteDialogOpen(false);
                  setDeleteError('');
                  setDeletingBooking(null);
                }}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDeleteBooking}
                disabled={isDeleting || !deletingBooking}
              >
                {isDeleting ? 'Deleting...' : 'Delete Booking'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {tableError ? (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {tableError}
          </div>
        ) : null}

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
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      Loading bookings...
                    </td>
                  </tr>
                ) : bookings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      No bookings found.
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-slate-500" />
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{booking.name}</div>
                          <div className="text-xs text-slate-500">ID: {booking.id.substring(0,8)}...</div>
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
                      <div className="font-medium text-slate-900">{getServiceLabel(booking.service)}</div>
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
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-slate-400 hover:text-slate-900"
                              disabled={actionBookingId === booking.id}
                            />
                          }
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuGroup>
                            <DropdownMenuLabel>Manage booking</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => openEditDialog(booking)}
                            >
                              Edit Booking
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                          <DropdownMenuSeparator />
                          {getAllowedStatusTransitions(booking.status).map((nextStatus) => (
                            <DropdownMenuItem
                              key={nextStatus}
                              onClick={() => handleUpdateStatus(booking.id, nextStatus)}
                            >
                              {nextStatus === 'pending'
                                ? 'Mark as Pending'
                                : nextStatus === 'confirmed'
                                  ? 'Mark as Confirmed'
                                  : 'Mark as Completed'}
                            </DropdownMenuItem>
                          ))}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            variant="destructive"
                            disabled={!canDeleteBooking(booking.status)}
                            onClick={() => openDeleteDialog(booking)}
                          >
                            Delete Booking
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
        </Card>

      </main>
    </div>
  );
}
