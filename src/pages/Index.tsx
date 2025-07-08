
import React, { useState, useEffect, useCallback } from 'react';
import SongForm from '@/components/SongForm';
import SongChart from '@/components/SongChart';
import { ChordTransposer } from '@/components/ChordTransposer';
import { KeyboardShortcutsHelp } from '@/components/KeyboardShortcutsHelp';
import ThemeToggle from '@/components/ThemeToggle';
import { LayoutType, SongData } from '@/types/song';
import { createEmptySong, getSampleSongData } from '@/utils/songTemplates';
import { transposeSong, calculateTargetKey, getIntervalName } from '@/utils/simpleTransposer';
import { useAutoSave } from '@/hooks/useAutoSave';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useAuthStore } from '@/stores/useAuthStore';
import { useSongStore } from '@/stores/useSongStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { MusicIcon, TextIcon, KeyboardIcon } from 'lucide-react';
import { MySongsDropdown } from '@/components/MySongsDropdown';
import { LoginModal } from '@/components/auth/LoginModal';
import { SongLibraryModal } from '@/components/SongLibraryModal';

const Index = () => {
  const { toast } = useToast();
  const { user } = useAuthStore();
  const { 
    currentSong, 
    loadSong, 
    createSong, 
    updateSong,
    setCurrentSong,
    deleteSong,
    toggleFavorite,
    songs 
  } = useSongStore();
  
  const [songData, setSongData] = useState<SongData>(getSampleSongData());
  const [layout, setLayout] = useState<LayoutType>(LayoutType.TWO_COLUMN);
  const [isEditing, setIsEditing] = useState(true);
  const [showChords, setShowChords] = useState<boolean>(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showLibraryModal, setShowLibraryModal] = useState(false);
  
  // Estado para manejar transposiciones desde el original (como en ChordTransposer)
  const [originalSong, setOriginalSong] = useState<SongData>(getSampleSongData());
  const [currentTransposition, setCurrentTransposition] = useState(0);
  

  // Handler functions (defined before hooks that use them)
  const handleSongUpdate = async (updatedSong: SongData) => {
    // Hacer una copia profunda para la referencia original
    const originalCopy = structuredClone(updatedSong);
    setSongData(updatedSong);
    setOriginalSong(originalCopy); // Guardar una copia profunda como original
    setCurrentTransposition(0); // Reset transposition
    
    // Save to database if user is authenticated (silently)
    if (user) {
      try {
        if (currentSong?.id) {
          // Update existing song
          await updateSong(currentSong.id, updatedSong);
        } else {
          // Create new song
          const songId = await createSong(updatedSong, user.uid);
          // Update current song reference but don't navigate
          const newSong = { ...updatedSong, id: songId } as any;
          setCurrentSong(newSong);
        }
      } catch (error) {
        console.error('Error saving:', error);
      }
    }
    
    toast({
      title: "Guía Actualizada",
      description: "Tu guía de alabanza ha sido actualizada exitosamente.",
    });
    
    setIsEditing(false);
  };

  const handleNewSong = () => {
    const newSong = createEmptySong();
    const originalCopy = structuredClone(newSong);
    setSongData(newSong);
    setOriginalSong(originalCopy); // Guardar una copia profunda como original
    setCurrentTransposition(0); // Reset transposition
    setCurrentSong(null); // Clear current song reference
    setIsEditing(true);
  };

  const handleEditSong = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleLoadSong = async (songId: string) => {
    try {
      await loadSong(songId);
      // currentSong will be updated via the store
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cargar la canción",
        variant: "destructive"
      });
    }
  };

  const handlePrint = useCallback(() => {
    // Guardar el título original
    const originalTitle = document.title;
    
    // Cambiar el título temporalmente para la impresión
    document.title = `${songData.title} - ${songData.artist}`;
    
    // Imprimir
    window.print();
    
    // Restaurar el título original después de un breve retraso
    setTimeout(() => {
      document.title = originalTitle;
    }, 100);
  }, [songData.title, songData.artist]);

  const handleDisplayModeChange = (value: string) => {
    setShowChords(value === 'chords-lyrics');
  };

  const handleTranspose = useCallback((transposedSong: SongData) => {
    setSongData(transposedSong);
    // No actualizar originalSong aquí - el ChordTransposer maneja su propia referencia
    toast({
      title: "Acordes Transpuestos",
      description: "Los acordes han sido transpuestos exitosamente.",
    });
  }, [toast]);

  const handleKeyboardTranspose = useCallback((direction: 1 | -1) => {
    if (isEditing) return; // Only allow transpose in view mode
    
    // Actualizar la transposición total
    const newTransposition = currentTransposition + direction;
    setCurrentTransposition(newTransposition);
    
    // Transponer desde la canción original usando el nuevo total
    const transposedSong = transposeSong(originalSong, newTransposition);
    setSongData(transposedSong);
    
    const directionText = direction > 0 ? "subido" : "bajado";
    const intervalName = getIntervalName(Math.abs(direction));
    
    toast({
      title: `Acordes ${directionText}`,
      description: `Se ha ${directionText} ${Math.abs(direction)} semitono(s) - ${intervalName}`,
    });
  }, [isEditing, currentTransposition, originalSong, toast]);

  // Handle song deletion
  const handleDeleteSong = async (songId: string) => {
    try {
      await deleteSong(songId);
      
      // Si se eliminó la canción actual, crear una nueva
      if (currentSong?.id === songId) {
        const newSong = createEmptySong();
        setSongData(newSong);
        setOriginalSong(structuredClone(newSong));
        setCurrentTransposition(0);
        setCurrentSong(null);
      }
      
      toast({
        title: "Guía eliminada",
        description: "La guía se eliminó correctamente",
      });
    } catch (error) {
      toast({
        title: "Error al eliminar",
        description: "No se pudo eliminar la guía",
        variant: "destructive",
      });
    }
  };

  // AutoSave eliminado completamente

  // Keyboard shortcuts
  const { getShortcutText } = useKeyboardShortcuts({
    shortcuts: [
      {
        key: 'p',
        ctrl: true,
        action: handlePrint,
        description: 'Imprimir guía'
      },
      {
        key: 'n',
        ctrl: true,
        action: handleNewSong,
        description: 'Nueva guía'
      },
      {
        key: 'e',
        ctrl: true,
        action: () => !isEditing && handleEditSong(),
        description: 'Editar guía'
      },
      {
        key: 'ArrowUp',
        ctrl: true,
        action: () => handleKeyboardTranspose(1),
        description: 'Transponer hacia arriba'
      },
      {
        key: 'ArrowDown',
        ctrl: true,
        action: () => handleKeyboardTranspose(-1),
        description: 'Transponer hacia abajo'
      },
      {
        key: 'h',
        ctrl: true,
        action: () => setShowChords(!showChords),
        description: 'Alternar vista de acordes'
      },
      {
        key: 'k',
        ctrl: true,
        action: () => {
          if (user) {
            setShowLibraryModal(true);
          }
        },
        description: 'Abrir biblioteca de guías'
      }
    ],
    enabled: true
  });

  // Initialize with sample song for new users
  useEffect(() => {
    if (!user && !currentSong) {
      const sampleSong = getSampleSongData();
      setSongData(sampleSong);
      setOriginalSong(structuredClone(sampleSong));
    }
  }, [user, currentSong]);

  // Update local state when currentSong changes
  useEffect(() => {
    if (currentSong) {
      setSongData(currentSong);
      setOriginalSong(structuredClone(currentSong));
      setCurrentTransposition(0);
    }
  }, [currentSong]);

  // Auto-save hook (silent)
  useAutoSave(songData, {
    enabled: !!user && isEditing,
    onSave: () => {
      // Silent save
    },
    onError: (error) => {
      console.error('AutoSave error:', error);
    }
  });

  // Load showChords preference from localStorage
  useEffect(() => {
    const savedShowChords = localStorage.getItem('showChords');
    if (savedShowChords !== null) {
      setShowChords(savedShowChords === 'true');
    }
  }, []);

  // Save showChords preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('showChords', showChords.toString());
  }, [showChords]);


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-200">
      <style>
        {`
        /* Ensure consistent monospace font across environments */
        .chord-section {
          font-family: "Courier New", monospace !important;
          letter-spacing: 0;
          white-space: pre;
        }
        
        /* Force exact character positioning */
        .chord-section span.absolute {
          position: absolute !important;
        }
        
        /* Make chord and lyric positioning more consistent for printing */
        @media print {
          @page {
            size: letter;
            margin: 0.5in;
          }
          
          .chord-lyric-container {
            page-break-inside: avoid;
            font-family: "Courier New", monospace !important;
            letter-spacing: 0;
            white-space: pre;
          }
          
          .chord-section {
            font-family: "Courier New", monospace !important;
            letter-spacing: 0;
            white-space: pre;
          }
          
          /* Force exact positioning in print mode */
          .chord-section .absolute {
            position: absolute !important;
            font-family: "Courier New", monospace !important;
          }
        }
        `}
      </style>
      <div className="container max-w-7xl mx-auto px-4 print:p-0">
        <div className="mb-8 print:hidden">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <MySongsDropdown
              onNewSong={handleNewSong}
              onLoadSong={handleLoadSong}
              onSaveClick={() => setShowLoginModal(true)}
              onOpenLibrary={() => setShowLibraryModal(true)}
            />
            <ThemeToggle />
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">Alabanza Chart Maker</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Crea y personaliza guías de alabanza profesionales
            </p>
          </div>
        </div>

        {isEditing ? (
          <div className="print:hidden">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Editor de Guía</h2>
              <div className="flex gap-2">
              </div>
            </div>
            <SongForm 
              initialSong={songData} 
              onSongUpdate={handleSongUpdate} 
              onLayoutChange={setLayout}
              currentLayout={layout}
            />
          </div>
        ) : (
          <>
            <div className="mb-6 print:hidden">
              <div className="flex flex-wrap justify-between items-center gap-4">
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleEditSong}>
                    Editar
                  </Button>
                  <Button variant="outline" onClick={handleNewSong}>
                    Nueva Guía
                  </Button>
                </div>
                
                <div className="flex items-center gap-6">
                  <ChordTransposer
                    song={songData}
                    onTranspose={handleTranspose}
                    className="border-r pr-6"
                  />
                  
                  <div className="flex items-center">
                    <span className="mr-2 text-sm font-medium">Vista:</span>
                    <ToggleGroup type="single" value={showChords ? 'chords-lyrics' : 'lyrics-only'} onValueChange={handleDisplayModeChange}>
                      <ToggleGroupItem value="chords-lyrics">
                        <span className="flex items-center">
                          <MusicIcon className="mr-1 h-4 w-4" />
                          Acordes + Letras
                        </span>
                      </ToggleGroupItem>
                      <ToggleGroupItem value="lyrics-only">
                        <span className="flex items-center">
                          <TextIcon className="mr-1 h-4 w-4" />
                          Letras
                        </span>
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <KeyboardShortcutsHelp />
                  <Button onClick={handlePrint}>
                    Imprimir
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden print:shadow-none">
              <SongChart 
                key="song-chart" 
                song={songData} 
                layout={layout} 
                showChords={showChords} 
              />
            </div>
          </>
        )}
      </div>
      
      {showLoginModal && (
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
        />
      )}
      
      {showLibraryModal && user && (
        <SongLibraryModal
          isOpen={showLibraryModal}
          onClose={() => setShowLibraryModal(false)}
          songs={songs}
          onSelectSong={handleLoadSong}
          onDeleteSong={handleDeleteSong}
          onToggleFavorite={async (songId) => {
            try {
              await toggleFavorite(songId);
              const song = songs.find(s => s.id === songId);
              const isFavorite = song?.tags?.includes('_favorite');
              
              toast({
                title: isFavorite ? "Eliminado de favoritos" : "Agregado a favoritos",
                description: `"${song?.title}" ${isFavorite ? 'ya no es' : 'ahora es'} una canción favorita`,
              });
            } catch (error) {
              toast({
                title: "Error",
                description: "No se pudo actualizar el estado de favorito",
                variant: "destructive",
              });
            }
          }}
          currentSongId={currentSong?.id}
        />
      )}
    </div>
  );
};

export default Index;
