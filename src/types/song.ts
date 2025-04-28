
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
