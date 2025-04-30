
/**
 * ChordLine Component
 * 
 * Renders a line of music with chord notations and lyrics text.
 * Handles proper styling and visual separation between chords and lyrics.
 */
import React from "react";
import { ChordLyricLine } from "../types/song";
import { cn } from "@/lib/utils";

interface ChordLineProps {
  /**
   * The chord and lyric data to display
   */
  line: ChordLyricLine;
  
  /**
   * Whether to show chord notations above lyrics
   * @default true
   */
  showChords?: boolean;
}

/**
 * Styles for the component using a consistent pattern
 * This makes styling more maintainable and keeps it separate from component logic
 */
const styles = {
  container: "mb-1 relative",
  chords: "text-sm leading-tight mb-0 text-black",
  lyrics: "text-base leading-tight text-black"
};

/**
 * ChordLine displays a single line of chord notations with corresponding lyrics below.
 * Ensures consistent styling with chords always bold and lyrics always normal weight.
 */
const ChordLine: React.FC<ChordLineProps> = ({ 
  line, 
  showChords = true 
}) => {
  // Avoid rendering empty lines
  const hasContent = (showChords && line.chords) || line.lyrics;
  
  if (!hasContent) {
    return null;
  }

  return (
    <div className={styles.container} data-testid="chord-line">
      {/* Chord notation section */}
      {showChords && line.chords && (
        <div 
          className={cn(styles.chords, "font-bold")}
          data-type="chord-notation"
          style={{ backgroundColor: 'transparent' }}
        >
          {line.chords}
        </div>
      )}
      
      {/* Lyrics section */}
      {line.lyrics && (
        <div 
          className={cn(styles.lyrics, "font-normal")}
          data-type="lyrics-text"
          style={{ backgroundColor: 'transparent' }}
        >
          {line.lyrics}
        </div>
      )}
    </div>
  );
};

export default ChordLine;
