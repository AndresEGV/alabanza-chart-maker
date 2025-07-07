import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useSongStore } from '@/stores/useSongStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown, Plus, Music, LogOut, Save } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface MySongsDropdownProps {
  onNewSong: () => void;
  onLoadSong: (songId: string) => void;
  onSaveClick: () => void;
}

export const MySongsDropdown: React.FC<MySongsDropdownProps> = ({
  onNewSong,
  onLoadSong,
  onSaveClick,
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

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          Mis Guías
          <ChevronDown className="ml-1 h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
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
            {songs.slice(0, 10).map((song) => (
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
                    {format(song.updatedAt, 'dd MMM', { locale: es })}
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
            {songs.length > 10 && (
              <DropdownMenuItem disabled>
                <span className="text-xs text-muted-foreground">
                  +{songs.length - 10} más
                </span>
              </DropdownMenuItem>
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