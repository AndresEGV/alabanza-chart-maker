
import { ChordLyricLine, ChordPosition } from "../types/song";
import { parseChordPositionsFromLyrics, convertTraditionalToPositions } from "./chordPositionParser";

// Convert text with line breaks into chord-lyric pairs
export const parseChordLyricTextInput = (text: string): ChordLyricLine[] => {
  if (!text) return [];
  
  // Remove carriage returns but keep line feeds for consistent line endings
  const normalizedText = text.replace(/\r/g, '');
  
  // Check if the input uses [chord] format (with or without attached words)
  if (normalizedText.includes('[') && normalizedText.includes(']')) {
    // Process input line by line for [chord] format
    const lines = normalizedText.split('\n');
    const result: ChordLyricLine[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Skip empty lines
      if (!line.trim()) {
        result.push({ chords: '', lyrics: '' });
        continue;
      }
      
      // Parse chord positions if this line contains [chord] markers
      if (line.includes('[') && line.includes(']')) {
        const { cleanLyrics, chordPositions } = parseChordPositionsFromLyrics(line);
        
        result.push({
          chords: '', // We'll generate chord line from positions for backward compatibility
          lyrics: cleanLyrics,
          chordPositions: chordPositions
        });
      } else {
        // Handle as regular text line (could be a chord line or lyrics line)
        result.push({
          chords: '',
          lyrics: line
        });
      }
    }
    
    // Now pair up chord lines with lyric lines for traditional format sections
    const finalResult: ChordLyricLine[] = [];
    let i = 0;
    
    while (i < result.length) {
      const currentLine = result[i];
      
      // If this line already has chord positions, add it directly
      if (currentLine.chordPositions && currentLine.chordPositions.length > 0) {
        finalResult.push(currentLine);
        i++;
        continue;
      }
      
      // Otherwise, check if this is a chord+lyrics pair in traditional format
      const nextLine = i + 1 < result.length ? result[i + 1] : null;
      
      if (nextLine && !nextLine.chordPositions) {
        // This looks like a traditional chord+lyric pair
        const chordPositions = convertTraditionalToPositions(currentLine.lyrics, nextLine.lyrics);
        
        finalResult.push({
          chords: currentLine.lyrics, // First line is chords
          lyrics: nextLine.lyrics,    // Second line is lyrics
          chordPositions: chordPositions // Add calculated positions
        });
        i += 2; // Skip both lines
      } else {
        // Special case: standalone chord line without associated lyrics
        if (currentLine.lyrics && currentLine.lyrics.trim() && !nextLine) {
          finalResult.push({
            chords: currentLine.lyrics,
            lyrics: '',
            chordPositions: []
          });
        } else {
          // This is just a single line
          finalResult.push(currentLine);
        }
        i++;
      }
    }
    
    return finalResult;
  } else {
    // Use traditional parsing for chord-over-lyric format
    const lines = normalizedText.split('\n');
    const result: ChordLyricLine[] = [];
    
    // Special case: if there's just one line with chords only
    if (lines.length === 1 && lines[0].trim()) {
      return [{ chords: lines[0], lyrics: '', chordPositions: [] }];
    }
    
    // Iterate over the lines in pairs (chord line followed by lyric line)
    for (let i = 0; i < lines.length; i += 2) {
      const chords = i < lines.length ? lines[i] || '' : '';
      const lyrics = i + 1 < lines.length ? lines[i + 1] || '' : '';
      
      // Skip empty line pairs (both chords and lyrics are empty)
      if (!chords.trim() && !lyrics.trim()) {
        // Only push an empty line if not at the end to preserve proper spacing
        if (i < lines.length - 2) {
          result.push({ chords: '', lyrics: '' });
        }
        continue;
      }
      
      // Special case: Last chord line without lyrics
      if (chords.trim() && i + 1 >= lines.length) {
        result.push({ chords, lyrics: '', chordPositions: [] });
        continue;
      }
      
      // Calculate chord positions for traditional format
      const chordPositions = convertTraditionalToPositions(chords, lyrics);
      
      result.push({
        chords,
        lyrics,
        chordPositions // Add calculated positions for traditional format
      });
    }
    
    return result;
  }
};
