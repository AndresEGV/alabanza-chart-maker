
import { ChordLyricLine } from "../types/song";

// Convert ChordLyricLine array back to text for editing
// This function is crucial for preserving exact user spacing
export const convertChordLyricLinesToText = (lines: ChordLyricLine[]): string => {
  if (!lines || !lines.length) return '';
  
  let result = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Add chord line exactly as it was (if it exists)
    if (line.chords && line.chords.trim()) {
      // Only add a newline before if this isn't the first item and the previous item had content
      if (i > 0) {
        result += '\n';
      }
      result += line.chords;
    }
    
    // Add lyrics line exactly as it was (if it exists)
    if (line.lyrics && line.lyrics.trim()) {
      // Only add a newline if we have chords above or if this isn't the first line
      if ((line.chords && line.chords.trim()) || (i > 0 && result !== '')) {
        result += '\n';
      }
      result += line.lyrics;
    }
    
    // Only add an extra newline between chord-lyric pairs if there's actual content
    // and we're not at the last item
    if (i < lines.length - 1 && 
        ((line.chords && line.chords.trim()) || (line.lyrics && line.lyrics.trim()))) {
      result += '\n';
    }
  }
  
  return result;
};
