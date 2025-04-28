
import React from "react";
import { ChordLyricLine } from "../types/song";

interface ChordLineProps {
  line: ChordLyricLine;
}

const ChordLine: React.FC<ChordLineProps> = ({ line }) => {
  return (
    <div className="mb-1 relative">
      {line.chords && (
        <div className="text-sm font-medium leading-tight mb-0">
          {line.chords}
        </div>
      )}
      {line.lyrics && (
        <div className="text-base leading-tight">{line.lyrics}</div>
      )}
    </div>
  );
};

export default ChordLine;
