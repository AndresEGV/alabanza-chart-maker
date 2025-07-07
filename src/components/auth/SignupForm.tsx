import React, { useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Loader2, Mail, Lock, User, Music } from 'lucide-react';
import { GoogleIcon } from '@/components/icons/GoogleIcon';

interface SignupFormProps {
  onSwitchToLogin?: () => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({ onSwitchToLogin }) => {
  const { signupWithEmail, loginWithGoogle, loading, error, setError } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
  });

  const handleChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    setError(null);
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      await signupWithEmail(formData.email, formData.password, formData.displayName);
      // Success - modal will close automatically
    } catch (error) {
      // Error is handled in the store
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await loginWithGoogle();
      // Success - modal will close automatically
    } catch (error) {
      // Error is handled in the store
    }
  };

  return (
    <div className="w-full">
      <CardHeader className="space-y-1 px-0 pt-0">
        <CardTitle className="text-xl">Crear cuenta</CardTitle>
        <CardDescription>
          Guarda tus guías de alabanza en la nube
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Button
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignup}
          disabled={loading}
        >
          <GoogleIcon className="mr-2 h-4 w-4" />
          Registrarse con Google
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">O regístrate con</span>
          </div>
        </div>

        <form onSubmit={handleEmailSignup} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Nombre</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="displayName"
                type="text"
                placeholder="Tu nombre"
                value={formData.displayName}
                onChange={handleChange('displayName')}
                className="pl-10"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={handleChange('email')}
                className="pl-10"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange('password')}
                className="pl-10"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange('confirmPassword')}
                className="pl-10"
                required
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creando cuenta...
              </>
            ) : (
              'Crear cuenta'
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <p className="text-center text-sm text-muted-foreground w-full">
          ¿Ya tienes una cuenta?{' '}
          <Button
            variant="link"
            className="p-0 h-auto font-semibold"
            onClick={onSwitchToLogin}
          >
            Inicia sesión
          </Button>
        </p>
      </CardFooter>
    </div>
  );
};