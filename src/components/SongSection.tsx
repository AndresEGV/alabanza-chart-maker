
import React from "react";
import { SongSection as SongSectionType, defaultSectionColors } from "../types/song";
import ChordLine from "./ChordLine";

interface SongSectionProps {
  section: SongSectionType;
}

const SongSection: React.FC<SongSectionProps> = ({ section }) => {
  // Determine section color based on first character (e.g., 'V' from 'V1')
  const baseType = section.type.charAt(0);
  const circleColor = section.color || defaultSectionColors[baseType] || defaultSectionColors.default;

  return (
    <div className="relative border border-chart-border rounded-md mb-4 p-4 bg-white">
      <div className="flex items-start mb-2">
        <div className="flex-shrink-0 -mt-7 -ml-7">
          <div 
            className="w-10 h-10 rounded-full border border-chart-sequence flex items-center justify-center font-semibold text-chart-sequence"
            style={{ backgroundColor: circleColor }}
          >
            {section.type}
          </div>
        </div>
        <h3 className="ml-2 font-bold text-lg">{section.title}</h3>
        {section.notes && section.notes.some(note => note.position === "left") && (
          <div className="ml-4 text-sm italic text-gray-600">
            {section.notes.filter(note => note.position === "left").map((note, i) => (
              <div key={i} className="whitespace-pre-line">{note.text}</div>
            ))}
          </div>
        )}
        <div className="flex-grow"></div>
        {section.notes && section.notes.some(note => note.position === "right") && (
          <div className="text-sm italic text-gray-600 text-right">
            {section.notes.filter(note => note.position === "right").map((note, i) => (
              <div key={i} className="whitespace-pre-line">{note.text}</div>
            ))}
          </div>
        )}
      </div>
      <div>
        {section.lines.map((line, index) => (
          <ChordLine key={index} line={line} />
        ))}
      </div>
    </div>
  );
};

export default SongSection;
