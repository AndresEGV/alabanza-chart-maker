import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Music, Calendar, Clock, Loader2, Trash2, Hash, Layers } from 'lucide-react';
import { format, isToday, isYesterday, isThisWeek, isThisMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import { SavedSong } from '@/stores/useSongStore';

interface SongLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  songs: SavedSong[];
  onSelectSong: (songId: string) => void;
  onDeleteSong?: (songId: string) => void;
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
  currentSongId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'recent' | 'favorites'>('all');
  const [loadingSongId, setLoadingSongId] = useState<string | null>(null);
  const [deletingSongId, setDeletingSongId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Calcular el tamaño/complejidad de una canción
  const getSongSize = (song: SavedSong) => {
    const sectionCount = song.sectionSequence.length;
    let totalLines = 0;
    
    Object.values(song.sections).forEach(section => {
      totalLines += section.lines.length;
    });
    
    if (totalLines <= 20 || sectionCount <= 3) return { label: 'Corta', color: 'text-green-600 dark:text-green-400' };
    if (totalLines <= 40 || sectionCount <= 5) return { label: 'Media', color: 'text-yellow-600 dark:text-yellow-400' };
    return { label: 'Larga', color: 'text-orange-600 dark:text-orange-400' };
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
                    const songSize = getSongSize(song);
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
                      {/* Indicador de tamaño */}
                      <div className={`absolute top-2 right-2 text-[10px] font-medium px-1.5 py-0.5 rounded ${songSize.color} bg-gray-100 dark:bg-gray-800`}>
                        {songSize.label}
                      </div>
                      
                      <div className="flex items-start gap-3">
                        {loadingSongId === song.id ? (
                          <Loader2 className="h-8 w-8 text-muted-foreground flex-shrink-0 mt-1 animate-spin" />
                        ) : (
                          <Music className="h-8 w-8 text-muted-foreground flex-shrink-0 mt-1" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="space-y-0.5">
                            <h4 className="font-medium truncate text-base">{song.title}</h4>
                            {song.artist && (
                              <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-3">
                            {song.key && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                                {song.key}
                              </span>
                            )}
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-muted text-muted-foreground">
                              {song.sectionSequence.length} partes
                            </span>
                            <span className="ml-auto text-xs text-muted-foreground">
                              {format(song.updatedAt, 'dd MMM', { locale: es })}
                            </span>
                          </div>
                        </div>
                        {onDeleteSong && (
                          <div className="flex items-start">
                            {confirmDeleteId === song.id ? (
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={(e) => handleConfirmDelete(e, song.id)}
                                  disabled={deletingSongId === song.id}
                                >
                                  {deletingSongId === song.id ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : (
                                    'Eliminar'
                                  )}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={handleCancelDelete}
                                >
                                  Cancelar
                                </Button>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => handleDeleteClick(e, song.id)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        )}
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