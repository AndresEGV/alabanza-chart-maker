
import React from "react";
import { ChordLyricLine } from "../types/song";

interface ChordLineProps {
  line: ChordLyricLine;
  showChords?: boolean;
}

const ChordLine: React.FC<ChordLineProps> = ({ line, showChords = true }) => {
  // Render the chord line with precise positioning
  const renderChords = () => {
    if (!line.chords || !showChords) return null;
    
    return (
      <div 
        className="text-sm font-bold text-black leading-tight mb-0 relative"
        style={{ 
          fontFamily: "monospace",
          fontWeight: 700,
          position: "relative",
          height: "1.5em"
        }}
      >
        {line.chords}
      </div>
    );
  };

  return (
    <div className="mb-1 chord-lyric-container">
      {renderChords()}
      {line.lyrics && (
        <div 
          className="text-base text-black leading-tight relative"
          style={{ 
            whiteSpace: "pre",
            fontFamily: "monospace",
            letterSpacing: "0",
            fontWeight: 400
          }}
        >
          {line.lyrics}
        </div>
      )}
    </div>
  );
};

export default ChordLine;
