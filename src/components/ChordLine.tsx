
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
                // Use exact character position for precise monospace positioning
                left: `${chordPos.position}ch`,
                bottom: 0,
                fontFamily: "monospace",
                letterSpacing: "0",
                whiteSpace: "pre",
                display: "inline-block"
              }}
            >
              {chordPos.chord}
            </span>
          ))}
        </div>
      );
    }
    
    // Use traditional chord line - ensuring exact monospace consistent rendering
    if (line.chords && showChords) {
      return (
        <div 
          className="text-sm font-bold leading-tight mb-0"
          style={{ 
            fontFamily: "monospace",
            fontWeight: 700,
            whiteSpace: "pre",
            letterSpacing: "0",
            lineHeight: 1.2,
            marginBottom: "0.2em",
            height: "1.2em",
            overflow: "visible"
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
          className="text-base leading-tight relative"
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
