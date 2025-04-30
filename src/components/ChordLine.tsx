
import React from "react";
import { ChordLyricLine } from "../types/song";

interface ChordLineProps {
  line: ChordLyricLine;
  showChords?: boolean;
}

const ChordLine: React.FC<ChordLineProps> = ({ line, showChords = true }) => {
  return (
    <div className="mb-1 relative">
      {showChords && line.chords && (
        <div className="text-sm font-bold text-black leading-tight mb-0">
          {line.chords}
        </div>
      )}
      {line.lyrics && (
        <div className="text-base font-normal text-black leading-tight" style={{ fontWeight: 'normal' }}>
          {line.lyrics}
        </div>
      )}
    </div>
  );
};

export default ChordLine;
