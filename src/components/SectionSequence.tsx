
import React from "react";
import { SectionType } from "../types/song";

interface SectionSequenceProps {
  sequence: SectionType[];
}

const SectionSequence: React.FC<SectionSequenceProps> = ({ sequence }) => {
  return (
    <div className="flex flex-wrap gap-2 my-4">
      {sequence.map((section, index) => (
        <div
          key={index}
          className="w-8 h-8 rounded-full border border-chart-sequence text-chart-sequence flex items-center justify-center font-medium text-sm"
          title={section}
        >
          {section}
        </div>
      ))}
    </div>
  );
};

export default SectionSequence;
