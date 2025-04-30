
import React from "react";
import { ChordLyricLine } from "../types/song";

interface ChordLineProps {
  line: ChordLyricLine;
  showChords?: boolean;
}

const ChordLine: React.FC<ChordLineProps> = ({ line, showChords = true }) => {
  // Parse the chord line to maintain proper spacing
  const processChordLine = () => {
    if (!line.chords) return null;
    
    // Preserva el espaciado exacto original usando un elemento pre-formatted
    return (
      <div 
        className="text-sm font-bold text-black leading-tight mb-0"
        style={{ 
          whiteSpace: "pre",
          fontFamily: "monospace", 
          letterSpacing: "0",
          fontWeight: 700 // Ensure chords are bold
        }}
      >
        {line.chords}
      </div>
    );
  };

  return (
    <div className="mb-1 relative">
      {showChords && line.chords && processChordLine()}
      {line.lyrics && (
        <div 
          className="text-base text-black leading-tight"
          style={{ 
            whiteSpace: "pre",
            fontFamily: "monospace",
            letterSpacing: "0",
            fontWeight: 400 // Ensure lyrics are regular weight
          }}
        >
          {line.lyrics}
        </div>
      )}
    </div>
  );
};

export default ChordLine;
