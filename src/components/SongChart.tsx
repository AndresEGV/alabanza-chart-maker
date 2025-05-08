
import React, { useState } from "react";
import { LayoutType, SongData } from "../types/song";
import SongSection from "./SongSection";
import SectionSequence from "./SectionSequence";
import MinimalistSongChart from "./MinimalistSongChart";

interface SongChartProps {
  song: SongData;
  layout?: LayoutType;
  showChords?: boolean;
}

const SongChart: React.FC<SongChartProps> = ({
  song,
  layout = LayoutType.TWO_COLUMN,
  showChords = true,
}) => {
  const [currentPage] = useState(1);
  const maxPage = song.totalPages || 1;

  // If minimalist layout is selected, use the MinimalistSongChart component
  if (layout === LayoutType.MINIMALIST) {
    return <MinimalistSongChart song={song} showChords={showChords} />;
  }

  // Function to organize sections for layout display
  const organizeSections = () => {
    // Get the sections in sequence order
    const orderedSections = song.sectionSequence
      .map((type) => song.sections[type])
      .filter((section) => {
        // Only include sections that have content
        return section && section.lines && section.lines.some((line) => line.chords || line.lyrics);
      });

    if (layout === LayoutType.SINGLE_COLUMN) {
      return { 
        leftColumn: orderedSections,
        rightColumn: []
      };
    } else {
      // Split into two columns
      const midpoint = Math.ceil(orderedSections.length / 2);
      return {
        leftColumn: orderedSections.slice(0, midpoint),
        rightColumn: orderedSections.slice(midpoint),
      };
    }
  };

  const { leftColumn, rightColumn } = organizeSections();

  return (
    <div className={`songchart bg-white text-black max-w-5xl mx-auto p-8 print:p-4 ${layout === LayoutType.SINGLE_COLUMN ? 'single-column' : 'two-column'}`}>
      <style>
        {`
        @font-face {
          font-family: 'CourierPrime';
          src: local('Courier New');
          font-display: swap;
        }
        
        .chord-lyric-container {
          position: relative;
          font-family: 'Courier New', monospace !important;
          letter-spacing: 0;
          white-space: pre;
          margin-bottom: 0 !important;
        }
        
        .chord-section {
          font-family: 'Courier New', monospace !important;
          letter-spacing: 0;
          white-space: pre;
        }
        
        .chord-section .absolute {
          position: absolute !important;
          font-family: 'Courier New', monospace !important;
          letter-spacing: 0;
          white-space: pre;
        }
        
        /* Remove excess spacing */
        .chord-section > div {
          margin-bottom: 0 !important;
        }
        
        .chord-section > div > div:first-child {
          margin-bottom: 0 !important;
          height: 1em !important;
        }
        
        /* Ensure two-column layout preserves chord positioning */
        .two-column .chord-section {
          width: 100%;
          box-sizing: border-box;
        }
        
        .two-column .chord-section span.absolute {
          position: absolute !important;
          /* Ensure chord position is exactly maintained */
          transform: none !important;
        }
        
        .two-column .chord-lyric-container {
          width: 100%;
          box-sizing: border-box;
        }
        
        @media print {
          .chord-lyric-container {
            page-break-inside: avoid;
            font-family: 'Courier New', monospace !important;
            letter-spacing: 0;
            white-space: pre;
            margin-bottom: 0 !important;
          }
          
          /* For Firefox and Chromium print rendering */
          .chord-section, .chord-lyric-container {
            font-family: 'Courier New', monospace !important;
            font-size: 1rem;
            letter-spacing: 0;
          }
          
          /* Ensure exact positioning in print mode */
          .chord-section span.absolute {
            position: absolute !important;
            font-family: 'Courier New', monospace !important;
            white-space: pre;
          }
          
          /* Fix for two-column printing */
          .two-column .songchart {
            display: grid;
            grid-template-columns: 1fr 1fr;
            column-gap: 2rem;
          }
          
          .two-column .chord-section {
            width: 100%;
            position: relative;
          }
        }
        `}
      </style>
      
      {/* Header */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{song.title}</h1>
          <div className="text-lg">{song.artist}</div>
        </div>
        <div className="text-right">
          <div>Página: {currentPage}/{maxPage}</div>
          <div>Tono: {song.key}</div>
          <div>Tempo: {song.tempo}</div>
          <div>Time: {song.timeSignature}</div>
        </div>
      </div>

      {/* Section Sequence */}
      <SectionSequence sequence={song.sectionSequence} />

      {/* Song Content */}
      <div className={`grid ${layout === LayoutType.TWO_COLUMN ? 'grid-cols-2 gap-8 two-column-grid' : 'grid-cols-1'}`}>
        <div className="column-content">
          {leftColumn.map((section) => (
            <SongSection key={section.type} section={section} showChords={showChords} />
          ))}
        </div>
        {layout === LayoutType.TWO_COLUMN && rightColumn.length > 0 && (
          <div className="column-content">
            {rightColumn.map((section) => (
              <SongSection key={section.type} section={section} showChords={showChords} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {(song.composer || song.copyright) && (
        <div className="mt-8 text-sm text-gray-600 flex justify-between">
          <div>
            {song.composer && <span>Compositores: {song.composer}</span>}
          </div>
          <div>
            {song.copyright && <span>{song.copyright}</span>}
          </div>
        </div>
      )}
    </div>
  );
};

export default SongChart;
