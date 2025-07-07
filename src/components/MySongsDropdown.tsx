import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useSongStore } from '@/stores/useSongStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown, Plus, Music, LogOut, Save, User, Library } from 'lucide-react';
import { format, formatDistanceToNow, isToday, isYesterday, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';

interface MySongsDropdownProps {
  onNewSong: () => void;
  onLoadSong: (songId: string) => void;
  onSaveClick: () => void;
  onOpenLibrary?: () => void;
}

export const MySongsDropdown: React.FC<MySongsDropdownProps> = ({
  onNewSong,
  onLoadSong,
  onSaveClick,
  onOpenLibrary,
}) => {
  const { user, logout } = useAuthStore();
  const { songs, fetchUserSongs, loading } = useSongStore();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (user && open) {
      fetchUserSongs(user.uid);
    }
  }, [user, open]);

  if (!user) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={onSaveClick}
      >
        Iniciar Sesión
      </Button>
    );
  }

  // Obtener las iniciales del usuario
  const getUserInitials = (email: string) => {
    const parts = email.split('@')[0].split('.');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return email.substring(0, 2).toUpperCase();
  };

  const userInitials = getUserInitials(user.email || 'U');

  // Función para obtener fecha relativa
  const getRelativeDate = (date: Date) => {
    if (isToday(date)) return 'Hoy';
    if (isYesterday(date)) return 'Ayer';
    
    const days = differenceInDays(new Date(), date);
    if (days < 7) return `Hace ${days} días`;
    if (days < 30) return `Hace ${Math.floor(days / 7)} semanas`;
    
    return format(date, 'dd MMM', { locale: es });
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
            {userInitials}
          </div>
          <span className="hidden sm:inline-block">Mis Guías</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.email}</p>
            <p className="text-xs leading-none text-muted-foreground">
              Sesión iniciada
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onNewSong}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Guía
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {loading ? (
          <DropdownMenuItem disabled>
            <span className="text-muted-foreground">Cargando...</span>
          </DropdownMenuItem>
        ) : songs.length === 0 ? (
          <DropdownMenuItem disabled>
            <span className="text-muted-foreground">No hay guías guardadas</span>
          </DropdownMenuItem>
        ) : (
          <>
            {/* Mostrar solo las 5 canciones más recientes */}
            {songs.slice(0, 5).map((song) => (
              <DropdownMenuItem
                key={song.id}
                onClick={() => {
                  onLoadSong(song.id);
                  setOpen(false);
                }}
                className="cursor-pointer"
              >
                <Music className="mr-2 h-4 w-4 flex-shrink-0" />
                <div className="flex-1 overflow-hidden">
                  <div className="font-medium text-sm truncate">{song.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {getRelativeDate(song.updatedAt)}
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
            
            {/* Opción para ver toda la biblioteca */}
            {songs.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    onOpenLibrary?.();
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  <Library className="mr-2 h-4 w-4" />
                  <span className="font-medium">Ver biblioteca completa</span>
                  <div className="ml-auto flex items-center gap-2">
                    {songs.length > 5 && (
                      <span className="text-xs text-muted-foreground">
                        {songs.length} guías
                      </span>
                    )}
                    <kbd className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground border">
                      ⌘K
                    </kbd>
                  </div>
                </DropdownMenuItem>
              </>
            )}
          </>
        )}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem
          onClick={async () => {
            await logout();
            setOpen(false);
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar Sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};