import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/common/Logo';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Lock } from 'lucide-react';

export function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Dummy authentication check
    if (password === 'admin123') {
      // Simulate setting an auth token/state
      sessionStorage.setItem('isAdmin', 'true');
      navigate('/admin/dashboard');
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-slate-200">
        <CardHeader className="space-y-4 text-center pt-8">
          <div className="flex justify-center mb-2">
            <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-brand-600" />
            </div>
          </div>
          <div className="flex justify-center">
            <Logo />
          </div>
          <CardTitle className="text-2xl mt-4">Admin Access</CardTitle>
          <CardDescription>
            Enter your password to access the bookings dashboard.
            <br/>
            <span className="text-xs text-slate-400">(Hint: password is 'admin123')</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                className={error ? 'border-red-500 focus-visible:ring-red-500' : ''}
                placeholder="••••••••"
                required
              />
              {error && (
                <p className="text-sm text-red-500 mt-1">Incorrect password. Please try again.</p>
              )}
            </div>
            <Button type="submit" className="w-full bg-brand-600 hover:bg-brand-700 text-white">
              Log In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}