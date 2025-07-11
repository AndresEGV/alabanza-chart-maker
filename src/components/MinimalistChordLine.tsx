
import React from "react";
import { ChordLyricLine } from "../types/song";
import { parseFormattedText } from "../utils/textFormatter";

interface MinimalistChordLineProps {
  line: ChordLyricLine;
  showChords?: boolean;
}

const MinimalistChordLine: React.FC<MinimalistChordLineProps> = React.memo(({ 
  line, 
  showChords = true 
}) => {
  // Function to render chords with explicit positioning
  const renderPositionedChords = () => {
    // If showChords is false, don't render chords
    if (!showChords) return null;
    
    // Special case: If we only have chords without lyrics, show them directly
    if (line.chords && !line.lyrics) {
      return (
        <div 
          className="chord text-sm font-bold leading-none mb-1"
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
        <div className="relative h-4 mb-0 chord-diagram">
          {line.chordPositions.map((chordPos, index) => (
            <span
              key={index}
              className="absolute text-sm font-bold chord"
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
          className="text-sm font-bold leading-none mb-0 chord"
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
        >
          {line.chords}
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="mb-0 chord-lyric-container">
      {renderPositionedChords()}
      {line.lyrics && (
        <div 
          className="text-base leading-tight relative lyric"
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
});

MinimalistChordLine.displayName = 'MinimalistChordLine';

export default MinimalistChordLine;
