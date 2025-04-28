// Song section types
export type SectionType = string;

export interface ChordLyricLine {
  chords: string;
  lyrics: string;
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

// Default section colors - updated for circle backgrounds
export const defaultSectionColors: Record<string, string> = {
  "I": "#D3E4FD",   // Soft Blue for Intro
  "V": "#F2FCE2",   // Soft Green for Verse 
  "C": "#FDE1D3",   // Soft Peach for Chorus
  "B": "#FEC6A1",   // Soft Orange for Bridge
  "P": "#FFDEE2",   // Soft Pink for Pre-Chorus
  "R": "#E5DEFF",   // Soft Purple for Refrain
  "O": "#FEF7CD",   // Soft Yellow for Outro
  "default": "#F1F0FB" // Soft Gray for other sections
};
