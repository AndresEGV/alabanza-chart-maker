
import React from "react";
import { ChordLyricLine, ChordPosition } from "../types/song";
import { parseFormattedText } from "../utils/textFormatter";

interface ChordLineProps {
  line: ChordLyricLine;
  showChords?: boolean;
}

// Custom comparison function for React.memo
const areEqual = (prevProps: ChordLineProps, nextProps: ChordLineProps) => {
  // Compare basic properties
  if (prevProps.showChords !== nextProps.showChords ||
      prevProps.line.chords !== nextProps.line.chords ||
      prevProps.line.lyrics !== nextProps.line.lyrics ||
      (prevProps.line as any)._transpositionKey !== (nextProps.line as any)._transpositionKey) {
    return false;
  }
  
  // Compare chord positions arrays
  const prevPositions = prevProps.line.chordPositions || [];
  const nextPositions = nextProps.line.chordPositions || [];
  
  if (prevPositions.length !== nextPositions.length) {
    return false;
  }
  
  for (let i = 0; i < prevPositions.length; i++) {
    if (prevPositions[i].chord !== nextPositions[i].chord ||
        prevPositions[i].position !== nextPositions[i].position) {
      return false;
    }
  }
  
  return true;
};

const ChordLine: React.FC<ChordLineProps> = ({ line, showChords = true }) => {
  // Function to render chords with explicit positioning
  const renderPositionedChords = () => {
    // If showChords is false, don't render chords
    if (!showChords) return null;
    
    // Special case: If we only have chords without lyrics, show them directly
    if (line.chords && !line.lyrics) {
      return (
        <div 
          key={`chords-only-${line.chords}`}
          className="text-sm font-bold leading-none mb-2"
          style={{ 
            fontFamily: "'Courier New', monospace",
            fontWeight: 700,
            whiteSpace: "pre",
            letterSpacing: "0",
            lineHeight: "1",
            height: "1em",
            overflow: "visible"
          }}
        >
          {line.chords}
        </div>
      );
    }
    
    // If we have explicit chord positions and lyrics, use those
    if (line.chordPositions && line.chordPositions.length > 0 && line.lyrics) {
      return (
        <div className="relative h-4 mb-0 chord-section">
          {line.chordPositions.map((chordPos, index) => (
            <span
              key={index}
              className="absolute text-sm font-bold"
              style={{
                // Use exact character position for precise monospace positioning
                left: `${chordPos.position}ch`,
                bottom: 0,
                fontFamily: "'Courier New', monospace",
                letterSpacing: "0",
                whiteSpace: "pre",
                lineHeight: "1",
                display: "inline-block",
                width: "auto", // Allow chord width to be natural
                minWidth: "fit-content", // Ensure the chord text isn't truncated
                transform: "translateX(0)", // Ensure no transformation affects positioning
                textAlign: "left" // Ensure text alignment is consistent
              }}
            >
              {chordPos.chord}
            </span>
          ))}
        </div>
      );
    }
    
    // Use traditional chord line - ensuring exact monospace consistent rendering
    if (line.chords && showChords && line.lyrics) {
      return (
        <div 
          key={`chords-${line.chords}`}
          className="text-sm font-bold leading-none mb-0"
          style={{ 
            fontFamily: "'Courier New', monospace",
            fontWeight: 700,
            whiteSpace: "pre",
            letterSpacing: "0",
            lineHeight: "1",
            marginBottom: "0",
            height: "1em",
            overflow: "visible",
            position: "relative" // Ensure positioning context
          }}
          dangerouslySetInnerHTML={{ __html: line.chords }}
        />
      );
    }
    
    return null;
  };

  return (
    <div className="mb-0 chord-lyric-container">
      {renderPositionedChords()}
      {line.lyrics && (
        <div 
          className="text-base leading-tight relative"
          style={{ 
            whiteSpace: "pre",
            fontFamily: "'Courier New', monospace",
            letterSpacing: "0",
            lineHeight: "1.1",
            marginTop: "0"
          }}
        >
          {parseFormattedText(line.lyrics).map((segment, index) => (
            <span
              key={index}
              style={{
                fontWeight: segment.bold ? 'bold' : 'normal',
                fontStyle: segment.italic ? 'italic' : 'normal'
              }}
            >
              {segment.text}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

ChordLine.displayName = 'ChordLine';

export default ChordLine;
