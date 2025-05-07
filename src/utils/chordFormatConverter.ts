
import { ChordLyricLine } from "../types/song";

// Convert ChordLyricLine array back to text for editing
// This function is crucial for preserving exact user spacing
export const convertChordLyricLinesToText = (lines: ChordLyricLine[]): string => {
  if (!lines || !lines.length) return '';
  
  let result = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Add empty line before each pair except the first
    if (i > 0) {
      result += '\n\n'; // Double newline for separation between pairs
    }
    
    // Add chord line exactly as it was
    result += line.chords || '';
    result += '\n'; // Single newline between chords and lyrics
    
    // Add lyrics line exactly as it was
    result += line.lyrics || '';
  }
  
  return result;
};
