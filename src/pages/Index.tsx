
import React, { useState } from 'react';
import SongForm from '@/components/SongForm';
import SongChart from '@/components/SongChart';
import { LayoutType, SongData } from '@/types/song';
import { createEmptySong, getSampleSongData } from '@/utils/songUtils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [songData, setSongData] = useState<SongData>(getSampleSongData());
  const [layout, setLayout] = useState<LayoutType>(LayoutType.TWO_COLUMN);
  const [isEditing, setIsEditing] = useState(true);

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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
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
            <div className="mb-6 flex justify-between items-center print:hidden">
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleEditSong}>
                  Editar
                </Button>
                <Button variant="outline" onClick={handleNewSong}>
                  Nueva Guía
                </Button>
              </div>
              <div>
                <Button onClick={handlePrint}>
                  Imprimir
                </Button>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden print:shadow-none">
              <SongChart song={songData} layout={layout} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
