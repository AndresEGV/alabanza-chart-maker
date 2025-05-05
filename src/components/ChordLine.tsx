
import React from "react";
import { ChordLyricLine, ChordPosition } from "../types/song";

interface ChordLineProps {
  line: ChordLyricLine;
  showChords?: boolean;
}

const ChordLine: React.FC<ChordLineProps> = ({ line, showChords = true }) => {
  // Function to render chords with explicit positioning
  const renderPositionedChords = () => {
    if (!line.lyrics || !showChords) return null;
    
    // If we have explicit chord positions, use those
    if (line.chordPositions && line.chordPositions.length > 0) {
      return (
        <div className="relative h-5 mb-1">
          {line.chordPositions.map((chordPos, index) => (
            <span
              key={index}
              className="absolute text-sm font-bold"
              style={{
                left: `${chordPos.position * 0.6}em`, // Adjust this factor based on your monospace font
                fontFamily: "monospace",
                bottom: 0,
              }}
            >
              {chordPos.chord}
            </span>
          ))}
        </div>
      );
    }
    
    // Fallback to old method if no explicit positions
    if (line.chords && showChords) {
      return (
        <div 
          className="text-sm font-bold text-black leading-tight mb-0 relative"
          style={{ 
            fontFamily: "monospace",
            fontWeight: 700,
            position: "relative",
            height: "1.5em",
            whiteSpace: "pre"
          }}
        >
          {line.chords}
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="mb-1 chord-lyric-container">
      {renderPositionedChords()}
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
