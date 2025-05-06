
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
                // Use ch units for precise monospace positioning
                left: `${chordPos.position}ch`,
                bottom: 0,
                fontFamily: "monospace",
                letterSpacing: "0",
                whiteSpace: "pre",
              }}
            >
              {chordPos.chord}
            </span>
          ))}
        </div>
      );
    }
    
    // Use traditional chord line - ensuring monospace consistent rendering
    if (line.chords && showChords) {
      return (
        <div 
          className="text-sm font-bold text-black leading-tight mb-0"
          style={{ 
            fontFamily: "monospace",
            fontWeight: 700,
            whiteSpace: "pre",
            lineHeight: 1.2,
            marginBottom: "0.2em",
            letterSpacing: "0",
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
            lineHeight: 1.2
          }}
        >
          {line.lyrics}
        </div>
      )}
    </div>
  );
};

export default ChordLine;
