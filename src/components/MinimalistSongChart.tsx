
import React from "react";
import { SongData, SectionType } from "../types/song";
import { defaultSectionColors } from "../types/song";
import MinimalistSongSection from "./MinimalistSongSection";

interface MinimalistSongChartProps {
  song: SongData;
  showChords?: boolean;
}

const MinimalistSongChart: React.FC<MinimalistSongChartProps> = ({
  song,
  showChords = true,
}) => {
  // Organize sections for layout display
  const organizeSections = () => {
    // Get the sections in sequence order with proper filtering
    const orderedSections = song.sectionSequence
      .map((type) => {
        const section = song.sections[type];
        return section ? { ...section, type } : null;
      })
      .filter((section) => {
        return section && section.lines && section.lines.some((line) => line.chords || line.lyrics);
      });

    // Create a balanced two-column distribution
    const leftColumn = [];
    const rightColumn = [];
    
    // Calculate total content lines more accurately
    const totalLines = orderedSections.reduce((total, section) => 
      total + (section.lines?.length || 0) + 2, // +2 for header/spacing
      0
    );
    
    let leftColumnLines = 0;
    const halfTotalLines = Math.ceil(totalLines / 2);
    
    // Distribute sections to achieve balance while maintaining flow:
    // Fill left column until approximately half of total lines, then start right column
    for (const section of orderedSections) {
      const sectionLines = (section.lines?.length || 0) + 2;
      
      if (leftColumnLines < halfTotalLines) {
        leftColumn.push(section);
        leftColumnLines += sectionLines;
      } else {
        rightColumn.push(section);
      }
    }

    return {
      leftColumn,
      rightColumn,
    };
  };

  const { leftColumn, rightColumn } = organizeSections();

  // Generate page text
  const pageText = `${song.pageNumber || 1}/${song.totalPages || 1}`;

  return (
    <div className="songchart bg-white text-black max-w-5xl mx-auto p-8 print:p-4">
      <style>
        {`
        @font-face {
          font-family: 'CourierPrime';
          src: local('Courier New');
          font-display: swap;
        }
        
        .minimalist-chart {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        
        .minimalist-chart .chord-lyric-container {
          position: relative;
          font-family: 'Courier New', monospace !important;
          letter-spacing: 0;
          white-space: pre;
          margin-bottom: 0 !important;
          line-height: 1.5;
        }
        
        .minimalist-chart .chord {
          font-family: 'Courier New', monospace !important;
          font-weight: bold;
          letter-spacing: 0;
          white-space: pre;
        }
        
        .minimalist-chart .lyric {
          font-family: 'Courier New', monospace !important;
          letter-spacing: 0;
          white-space: pre;
        }
        
        .minimalist-chart .section-container {
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          margin-bottom: 1rem;
          position: relative;
          overflow: hidden;
        }
        
        .minimalist-chart .section-header {
          display: flex;
          align-items: center;
          border-bottom: 1px solid #f3f4f6;
          padding-bottom: 0.5rem;
          margin-bottom: 0.5rem;
        }
        
        .minimalist-chart .section-circle {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.875rem;
          background-color: white;
          border-width: 2px;
          border-style: solid;
        }
        
        .minimalist-chart .section-title {
          margin-left: 0.5rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-size: 0.875rem;
        }
        
        .minimalist-chart .section-notes {
          margin-left: auto;
          font-style: italic;
          font-size: 0.75rem;
          color: #6b7280;
        }
        
        .minimalist-chart .chord-diagram {
          height: 1.25em;
          position: relative;
        }
        
        /* Page header styles */
        .minimalist-chart .page-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
        }
        
        /* Sequence styles */
        .minimalist-chart .sequence-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }
        
        .minimalist-chart .sequence-item {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.875rem;
          background-color: white;
          border-width: 2px;
          border-style: solid;
        }
        
        /* Two column layout with fixed grid - ensures proper flow */
        .minimalist-chart .two-column-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          page-break-inside: avoid;
          break-inside: avoid;
          width: 100%;
        }
        
        .minimalist-chart .column-content {
          page-break-inside: avoid;
          break-inside: avoid;
        }
        
        @media print {
          .minimalist-chart {
            padding: 0;
          }
          
          .minimalist-chart .two-column-grid {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 2rem !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            width: 100% !important;
          }
          
          .minimalist-chart .column-content {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          
          @page {
            margin: 0.5in;
            size: portrait;
          }
        }
        `}
      </style>
      
      <div className="minimalist-chart">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="text-3xl font-bold">{song.title}</h1>
            <div className="text-lg">{song.artist}</div>
          </div>
          <div className="text-right">
            <div>Página: {pageText}</div>
            <div>Tono: {song.key}</div>
            <div>Tempo: {song.tempo}</div>
            <div>Time: {song.timeSignature}</div>
          </div>
        </div>

        {/* Section Sequence */}
        <div className="sequence-container">
          {song.sectionSequence.map((sectionType, index) => {
            // Find the base color for this section type
            const baseType = sectionType.charAt(0);
            const circleColor = defaultSectionColors[sectionType] || 
                               defaultSectionColors[baseType] || 
                               defaultSectionColors.default;
            
            return (
              <div 
                key={index}
                className="sequence-item"
                style={{ borderColor: circleColor }}
                title={sectionType}
              >
                {sectionType}
              </div>
            );
          })}
        </div>

        {/* Song Content in Two Columns */}
        <div className="two-column-grid">
          <div className="column-content">
            {leftColumn.map((section, index) => (
              <MinimalistSongSection 
                key={`${section.type}-${index}`} 
                section={section} 
                showChords={showChords}
              />
            ))}
          </div>
          <div className="column-content">
            {rightColumn.map((section, index) => (
              <MinimalistSongSection 
                key={`${section.type}-${index}`} 
                section={section} 
                showChords={showChords}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        {(song.composer || song.copyright) && (
          <div className="mt-8 text-sm text-gray-600 flex justify-between border-t pt-4">
            <div>
              {song.composer && (
                <div className="text-xs">
                  Compositores: {song.composer}
                </div>
              )}
            </div>
            <div>
              {song.copyright && (
                <div className="text-xs">
                  {song.copyright}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MinimalistSongChart;
