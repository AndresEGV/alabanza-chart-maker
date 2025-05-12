
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
      // For two-column layout:
      // We need to ensure content flows properly according to standard publishing layout:
      // First fill left column completely, then right column, then move to next page
      
      // Create a simple sequential distribution - every other section goes to right column
      // This ensures content flows down left column first, then right column
      const leftColumn = [];
      const rightColumn = [];
      
      // Calculate total content size more accurately with line count
      const totalLines = orderedSections.reduce((total, section) => 
        total + (section.lines?.length || 0) + 2, // +2 for header/footer
        0
      );
      
      let leftColumnLines = 0;
      const targetLinesPerColumn = totalLines / 2;
      
      // Distribute sections to achieve balance while maintaining flow
      for (const section of orderedSections) {
        const sectionLines = (section.lines?.length || 0) + 2;
        
        // If left column is empty or not yet at half capacity, add to left
        // This gives priority to filling the left column first
        if (leftColumnLines < targetLinesPerColumn) {
          leftColumn.push(section);
          leftColumnLines += sectionLines;
        } else {
          // Once left column reaches half capacity, start filling right column
          rightColumn.push(section);
        }
      }

      return {
        leftColumn,
        rightColumn,
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
          
          /* Fix for two-column printing - force the browser to maintain columns */
          .two-column .songchart {
            display: flex !important;
            flex-wrap: wrap !important;
            justify-content: space-between !important;
          }
          
          .two-column {
            column-count: 2 !important;
            column-gap: 2rem !important;
            column-fill: balance !important;
            orphans: 2 !important;
            widows: 2 !important;
          }
          
          @page {
            margin: 0.5in;
          }
        }
        
        /* Improved two-column grid layout */
        .two-column-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          page-break-inside: avoid;
        }
        
        .column-content {
          page-break-inside: avoid;
          break-inside: avoid;
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

      {/* Song Content with proper left-to-right flow */}
      <div className={`${layout === LayoutType.TWO_COLUMN ? 'two-column-grid' : ''}`}>
        <div className="column-content">
          {leftColumn.map((section) => (
            <SongSection key={section.type} section={section} showChords={showChords} />
          ))}
        </div>
        {layout === LayoutType.TWO_COLUMN && (
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
