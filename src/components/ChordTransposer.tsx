import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { ChevronUp, ChevronDown, RotateCcw } from 'lucide-react';
import { transposeSong, calculateTargetKey, getIntervalName } from '../utils/simpleTransposer';
import { SongData } from '../types/song';

interface ChordTransposerProps {
  song: SongData;
  onTranspose: (transposedSong: SongData) => void;
  className?: string;
}

export function ChordTransposer({ song, onTranspose, className = "" }: ChordTransposerProps) {
  const [currentTransposition, setCurrentTransposition] = useState(0);
  const originalSongRef = useRef<SongData | null>(null);

  // Guardar la canción original cuando cambia la prop song
  useEffect(() => {
    // Solo actualizar la referencia original si realmente cambió la canción (no la transposición)
    if (!originalSongRef.current || 
        originalSongRef.current.title !== song.title || 
        originalSongRef.current.artist !== song.artist) {
      // Hacer una copia profunda para evitar mutaciones
      originalSongRef.current = structuredClone(song);
      setCurrentTransposition(0); // Reset transposition when song changes
    }
  }, [song.title, song.artist]); // Solo depender del título y artista, no de todo el objeto song

  const transposeUp = () => {
    const newTransposition = currentTransposition + 1;
    performTransposition(newTransposition);
    setCurrentTransposition(newTransposition);
  };

  const transposeDown = () => {
    const newTransposition = currentTransposition - 1;
    performTransposition(newTransposition);
    setCurrentTransposition(newTransposition);
  };

  const resetTransposition = () => {
    if (currentTransposition === 0) return;
    
    performTransposition(0);
    setCurrentTransposition(0);
  };

  const performTransposition = (totalSemitones: number) => {
    if (!originalSongRef.current) return;
    
    // Siempre transponer desde la canción original usando el total de semitonos
    const transposedSong = transposeSong(originalSongRef.current, totalSemitones);
    
    onTranspose(transposedSong);
  };

  const getTranspositionText = () => {
    if (currentTransposition === 0) return "Tono Original";
    
    const direction = currentTransposition > 0 ? "+" : "";
    const intervalName = getIntervalName(Math.abs(currentTransposition));
    
    return `${direction}${currentTransposition} (${intervalName})`;
  };

  const getKeyDisplay = () => {
    const originalKey = originalSongRef.current?.key || song.key;
    if (!originalKey) return "";
    
    if (currentTransposition === 0) return originalKey;
    
    const newKey = calculateTargetKey(originalKey, currentTransposition);
    return `${originalKey} → ${newKey}`;
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="flex items-center space-x-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={transposeDown}
              className="h-8 w-8 p-0"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Bajar un semitono (Ctrl + ↓)</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={transposeUp}
              className="h-8 w-8 p-0"
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Subir un semitono (Ctrl + ↑)</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={resetTransposition}
              disabled={currentTransposition === 0}
              className="h-8 w-8 p-0"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Restablecer al tono original</p>
          </TooltipContent>
        </Tooltip>
      </div>
      
      <div className="flex flex-col items-start min-w-0">
        <div className="text-sm font-medium text-gray-900">
          {getTranspositionText()}
        </div>
        {song.key && (
          <div className="text-xs text-gray-500">
            Tono: {getKeyDisplay()}
          </div>
        )}
      </div>
    </div>
  );
}