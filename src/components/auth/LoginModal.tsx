import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { useAuthStore } from '@/stores/useAuthStore';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const { user } = useAuthStore();

  // Close modal when user logs in
  useEffect(() => {
    if (user && isOpen) {
      onClose();
    }
  }, [user, isOpen, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Guarda tus guías en la nube</DialogTitle>
          <DialogDescription>
            Inicia sesión para guardar automáticamente tu trabajo y acceder desde cualquier dispositivo.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'login' | 'signup')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
            <TabsTrigger value="signup">Registrarse</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <LoginForm onSwitchToSignup={() => setActiveTab('signup')} />
          </TabsContent>
          
          <TabsContent value="signup">
            <SignupForm onSwitchToLogin={() => setActiveTab('login')} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};