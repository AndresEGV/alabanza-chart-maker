import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';
import { Music } from 'lucide-react';

export default function Auth() {
  const { user } = useAuthStore();
  const [isLogin, setIsLogin] = useState(true);

  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <Music className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Alabanza Chart Maker</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Crea y gestiona tus guías de alabanza profesionales
          </p>
        </div>

        {isLogin ? (
          <LoginForm onSwitchToSignup={() => setIsLogin(false)} />
        ) : (
          <SignupForm onSwitchToLogin={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
}