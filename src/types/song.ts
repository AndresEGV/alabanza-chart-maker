
// Song section types
export type SectionType = string;

export interface ChordPosition {
  chord: string;
  position: number; // character position in the lyrics where chord should appear
}

export interface ChordLyricLine {
  chords: string; // Original chord input (for backward compatibility)
  lyrics: string;
  chordPositions?: ChordPosition[]; // New field for explicit chord positioning
}

export interface SectionNote {
  text: string;
  position: "left" | "right";
}

export interface SongSection {
  type: SectionType;
  title: string;
  notes?: SectionNote[];
  lines: ChordLyricLine[];
  color?: string;
}

export interface SongData {
  title: string;
  artist: string;
  key: string;
  tempo: string;
  timeSignature: string;
  composer?: string;
  copyright?: string;
  sectionSequence: SectionType[];
  sections: Record<SectionType, SongSection>;
  pageNumber?: number;
  totalPages?: number;
}

export enum LayoutType {
  SINGLE_COLUMN = "single",
  TWO_COLUMN = "two-column"
}

// Default section colors - unique bold, highly saturated colors for each section type
export const defaultSectionColors: Record<string, string> = {
  "I": "#0EA5E9",  // Ocean Blue for Intro
  "V": "#8B5CF6",  // Vivid Purple for Verse
  "C": "#F97316",  // Bright Orange for Chorus
  "B": "#EA384C",  // Red for Bridge
  "P": "#D946EF",  // Magenta Pink for Pre-Chorus
  "R": "#10B981",  // Emerald Green for Refrain
  "Rf": "#4338CA", // Indigo for Reflection
  "Rp": "#059669", // Teal Green for Repeat
  "O": "#F59E0B",  // Amber for Outro
  "F": "#6366F1",  // Blue for Final
  "default": "#6B7280" // Slate Gray for other sections
};
