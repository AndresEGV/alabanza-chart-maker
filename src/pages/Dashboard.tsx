import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { useSongStore } from '@/stores/useSongStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Plus, 
  Search, 
  Music, 
  Calendar,
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  LogOut,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { songs, loading, fetchUserSongs, deleteSong } = useSongStore();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSongs, setFilteredSongs] = useState(songs);

  useEffect(() => {
    if (user) {
      fetchUserSongs(user.uid);
    }
  }, [user]);

  useEffect(() => {
    const filtered = songs.filter(song => 
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredSongs(filtered);
  }, [searchQuery, songs]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      toast.error('Error al cerrar sesión');
    }
  };

  const handleNewSong = () => {
    navigate('/');
  };

  const handleEditSong = (songId: string) => {
    navigate(`/song/${songId}`);
  };

  const handleDeleteSong = async (songId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta canción?')) {
      try {
        await deleteSong(songId);
        toast.success('Canción eliminada');
      } catch (error) {
        toast.error('Error al eliminar la canción');
      }
    }
  };

  const handleDuplicateSong = (songId: string) => {
    // TODO: Implementar duplicación
    toast.info('Función próximamente disponible');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Music className="h-8 w-8 text-primary mr-3" />
              <h1 className="text-xl font-semibold">Alabanza Chart Maker</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
              >
                {theme === 'light' ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.photoURL || ''} />
                      <AvatarFallback>
                        {user?.displayName?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user?.displayName}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button onClick={handleNewSong} className="sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Canción
          </Button>
          
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Buscar canciones..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Songs Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredSongs.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Music className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {searchQuery ? 'No se encontraron canciones' : 'No tienes canciones guardadas'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {searchQuery ? 'Intenta con otros términos de búsqueda' : 'Comienza creando tu primera guía de alabanza'}
              </p>
              {!searchQuery && (
                <Button onClick={handleNewSong}>
                  <Plus className="mr-2 h-4 w-4" />
                  Crear Primera Canción
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSongs.map((song) => (
              <Card 
                key={song.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleEditSong(song.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-1">{song.title}</CardTitle>
                      <CardDescription className="line-clamp-1">{song.artist}</CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          handleEditSong(song.id);
                        }}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicateSong(song.id);
                        }}>
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSong(song.id);
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className="text-xs">
                        {song.key}
                      </Badge>
                      {song.tempo && (
                        <Badge variant="outline" className="text-xs">
                          {song.tempo} BPM
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="mr-1 h-3 w-3" />
                      {format(song.updatedAt, 'dd MMM yyyy', { locale: es })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}