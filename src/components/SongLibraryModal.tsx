import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Music, Calendar, Clock, Loader2, Trash2, Star } from 'lucide-react';
import { format, isToday, isYesterday, isThisWeek, isThisMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import { SavedSong } from '@/stores/useSongStore';

interface SongLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  songs: SavedSong[];
  onSelectSong: (songId: string) => void;
  onDeleteSong?: (songId: string) => void;
  onToggleFavorite?: (songId: string) => void;
  currentSongId?: string;
}

interface GroupedSongs {
  [key: string]: SavedSong[];
}

export const SongLibraryModal: React.FC<SongLibraryModalProps> = ({
  isOpen,
  onClose,
  songs,
  onSelectSong,
  onDeleteSong,
  onToggleFavorite,
  currentSongId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'recent' | 'favorites'>('all');
  const [loadingSongId, setLoadingSongId] = useState<string | null>(null);
  const [deletingSongId, setDeletingSongId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Verificar si una canción es favorita
  const isFavorite = (song: SavedSong) => {
    return song.tags?.includes('_favorite') || false;
  };

  // Obtener indicador visual de tempo
  const getTempoIndicator = (tempo: string | undefined) => {
    if (!tempo) return null;
    
    const bpm = parseInt(tempo);
    if (isNaN(bpm)) return null;
    
    if (bpm < 80) return { icon: '♩', label: 'Lento', color: 'text-blue-600 dark:text-blue-400' };
    if (bpm < 120) return { icon: '♩♩', label: 'Moderado', color: 'text-green-600 dark:text-green-400' };
    return { icon: '♩♩♩', label: 'Rápido', color: 'text-orange-600 dark:text-orange-400' };
  };

  // Auto-focus search input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Agrupar canciones por fecha
  const groupedSongs = useMemo(() => {
    const filtered = songs.filter(song => {
      const matchesSearch = song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          song.artist?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          song.key?.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!matchesSearch) return false;
      
      if (selectedFilter === 'recent') {
        return isThisWeek(song.updatedAt);
      }
      
      if (selectedFilter === 'favorites') {
        return isFavorite(song);
      }
      
      return true;
    });

    const groups: GroupedSongs = {};

    filtered.forEach(song => {
      let groupKey = '';
      const date = song.updatedAt;

      if (isToday(date)) {
        groupKey = 'Hoy';
      } else if (isYesterday(date)) {
        groupKey = 'Ayer';
      } else if (isThisWeek(date)) {
        groupKey = 'Esta semana';
      } else if (isThisMonth(date)) {
        groupKey = 'Este mes';
      } else {
        groupKey = format(date, 'MMMM yyyy', { locale: es });
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(song);
    });

    // Ordenar cada grupo por fecha
    Object.keys(groups).forEach(key => {
      groups[key].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    });

    return groups;
  }, [songs, searchQuery, selectedFilter]);

  const handleSelectSong = async (songId: string) => {
    setLoadingSongId(songId);
    await onSelectSong(songId);
    setLoadingSongId(null);
    onClose();
  };

  const handleDeleteClick = (e: React.MouseEvent, songId: string) => {
    e.stopPropagation();
    setConfirmDeleteId(songId);
  };

  const handleConfirmDelete = async (e: React.MouseEvent, songId: string) => {
    e.stopPropagation();
    if (onDeleteSong) {
      setDeletingSongId(songId);
      await onDeleteSong(songId);
      setDeletingSongId(null);
      setConfirmDeleteId(null);
    }
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmDeleteId(null);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Biblioteca de Guías</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Barra de búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={searchInputRef}
              placeholder="Buscar por título, artista o tono..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-10"
            />
          </div>

          {/* Filtros */}
          <div className="flex gap-2">
            <Button
              variant={selectedFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFilter('all')}
            >
              Todas
            </Button>
            <Button
              variant={selectedFilter === 'recent' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFilter('recent')}
            >
              <Clock className="mr-2 h-3 w-3" />
              Recientes
            </Button>
            <Button
              variant={selectedFilter === 'favorites' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFilter('favorites')}
            >
              <Star className="mr-2 h-3 w-3" />
              Favoritas
            </Button>
          </div>
        </div>

        {/* Lista de canciones agrupadas */}
        <div className="flex-1 overflow-y-auto mt-4 pr-2">
          {Object.keys(groupedSongs).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No se encontraron guías
            </div>
          ) : (
            Object.entries(groupedSongs).map(([groupName, groupSongs]) => (
              <div key={groupName} className="mb-6">
                <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  {groupName}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {groupSongs.map((song) => {
                    const tempoInfo = getTempoIndicator(song.tempo);
                    return (
                      <button
                        key={song.id}
                        onClick={() => handleSelectSong(song.id)}
                        className={`
                          group p-4 rounded-lg border text-left transition-all w-full relative
                          hover:shadow-md hover:border-primary/50
                          ${currentSongId === song.id ? 'border-primary bg-primary/5' : 'border-border'}
                          ${loadingSongId === song.id ? 'opacity-50' : ''}
                        `}
                        disabled={loadingSongId !== null}
                      >
                      
                      <div className="flex items-start gap-3">
                        {loadingSongId === song.id ? (
                          <Loader2 className="h-8 w-8 text-muted-foreground flex-shrink-0 mt-1 animate-spin" />
                        ) : (
                          <Music className="h-8 w-8 text-muted-foreground flex-shrink-0 mt-1" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium truncate text-base">{song.title}</h4>
                              {song.artist && (
                                <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
                              )}
                            </div>
                            {onToggleFavorite && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onToggleFavorite(song.id);
                                }}
                                className="ml-2 p-1 hover:scale-110 transition-transform"
                              >
                                <Star 
                                  className={`h-4 w-4 ${
                                    isFavorite(song) 
                                      ? 'fill-yellow-500 text-yellow-500' 
                                      : 'text-gray-300 hover:text-gray-500'
                                  }`}
                                />
                              </button>
                            )}
                          </div>
                          
                          {/* Info simplificada */}
                          <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-3">
                              {song.key && (
                                <span className="font-medium text-foreground">{song.key}</span>
                              )}
                              {tempoInfo && (
                                <span className={`${tempoInfo.color}`} title={`${song.tempo} BPM`}>
                                  {tempoInfo.icon}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span>{format(song.updatedAt, 'dd MMM', { locale: es })}</span>
                              {onDeleteSong && (
                                <>
                                  {confirmDeleteId === song.id ? (
                                    <div className="flex gap-1">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-6 px-2 text-xs"
                                        onClick={handleCancelDelete}
                                      >
                                        Cancelar
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-6 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                                        onClick={(e) => handleConfirmDelete(e, song.id)}
                                        disabled={deletingSongId === song.id}
                                      >
                                        {deletingSongId === song.id ? (
                                          <Loader2 className="h-3 w-3 animate-spin" />
                                        ) : (
                                          'Eliminar'
                                        )}
                                      </Button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={(e) => handleDeleteClick(e, song.id)}
                                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 dark:hover:bg-red-950 rounded"
                                    >
                                      <Trash2 className="h-3 w-3 text-red-600 dark:text-red-400" />
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};