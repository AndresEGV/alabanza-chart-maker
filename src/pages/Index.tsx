
import React, { useState, useEffect } from 'react';
import SongForm from '@/components/SongForm';
import SongChart from '@/components/SongChart';
import { LayoutType, SongData } from '@/types/song';
import { createEmptySong, getSampleSongData } from '@/utils/songTemplates';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { MusicIcon, TextIcon } from 'lucide-react';

const Index = () => {
  const { toast } = useToast();
  const [songData, setSongData] = useState<SongData>(getSampleSongData());
  const [layout, setLayout] = useState<LayoutType>(LayoutType.TWO_COLUMN);
  const [isEditing, setIsEditing] = useState(true);
  const [showChords, setShowChords] = useState<boolean>(true);

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

  const handleSongUpdate = (updatedSong: SongData) => {
    setSongData(updatedSong);
    toast({
      title: "Guía Actualizada",
      description: "Tu guía de alabanza ha sido actualizada exitosamente.",
    });
    setIsEditing(false);
  };

  const handleNewSong = () => {
    setSongData(createEmptySong());
    setIsEditing(true);
  };

  const handleEditSong = () => {
    setIsEditing(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDisplayModeChange = (value: string) => {
    setShowChords(value === 'chords-lyrics');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
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
        <div className="mb-8 text-center print:hidden">
          <h1 className="text-4xl font-bold mb-2">Alabanza Chart Maker</h1>
          <p className="text-xl text-gray-600">
            Crea y personaliza guías de alabanza profesionales
          </p>
        </div>

        {isEditing ? (
          <div className="print:hidden">
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
                
                <div>
                  <Button onClick={handlePrint}>
                    Imprimir
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden print:shadow-none">
              <SongChart song={songData} layout={layout} showChords={showChords} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
