
import { SectionType, SongData } from "../types/song";

// Map section type to display name
export const getSectionTitle = (type: SectionType): string => {
  const titles: Record<SectionType, string> = {
    "I": "INTRO",
    "V1": "VERSO 1",
    "V2": "VERSO 2",
    "V3": "VERSO 3",
    "V4": "VERSO 4",
    "C1": "CORO 1",
    "C2": "CORO 2",
    "Pr": "PRE CORO",
    "Pr2": "PRE CORO",
    "Rf": "REFRAIN",
    "Rp": "REPETIR",
    "F": "FINAL"
  };
  
  return titles[type] || type;
};

// Generate page text (e.g. "1/2")
export const getPageText = (currentPage: number, totalPages: number): string => {
  return `${currentPage}/${totalPages}`;
};

// Parse chords from text input (supporting superscript notation)
export const parseChordText = (chordText: string): string => {
  return chordText.trim();
};
