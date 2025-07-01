
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
    // Get the sections in sequence order with unique indices
    const orderedSections = song.sectionSequence
      .map((type, sequenceIndex) => {
        const section = song.sections[type];
        return section ? { ...section, type, sequenceIndex } : null;
      })
      .filter((section) => {
        return section && section.lines && section.lines.some((line) => line.chords || line.lyrics);
      });

    // Split into two columns
    const midpoint = Math.ceil(orderedSections.length / 2);
    return {
      leftColumn: orderedSections.slice(0, midpoint),
      rightColumn: orderedSections.slice(midpoint),
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
          font-size: 1.05rem;
          font-weight: 500;
        }
        
        .minimalist-chart .section-container {
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          margin-bottom: 0.75rem;
          position: relative;
          overflow: visible;
          padding-top: 0.25rem;
        }
        
        .minimalist-chart .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          /* Quitamos la línea divisoria */
          padding-bottom: 0.125rem;
          margin-bottom: 0.125rem;
        }
        
        .minimalist-chart .section-circle {
          width: 1.5rem;
          height: 1.5rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.75rem;
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
          font-size: 0.625rem;
          color: #6b7280;
          line-height: 1.2;
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
          width: 1.75rem;
          height: 1.75rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.8rem;
          background-color: white;
          border-width: 2px;
          border-style: solid;
        }
        
        /* Two column layout */
        @media (min-width: 768px) {
          .minimalist-chart .two-column-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
          }
        }
        
        @media print {
          .minimalist-chart {
            padding: 0;
          }
          
          .minimalist-chart .two-column-grid {
            display: block !important;
            columns: 2 !important;
            column-gap: 2rem !important;
            column-fill: auto !important;
            width: 100% !important;
          }
          
          .minimalist-chart .column-content {
            display: contents !important;
          }
          
          /* Prevent sections from breaking across columns */
          .minimalist-chart .section-container {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
            margin-bottom: 1rem !important;
          }
          
          .page-break {
            page-break-after: always;
          }
          
          /* Print styles for page header */
          .minimalist-chart .page-header .text-gray-500 {
            color: #6b7280 !important;
            font-weight: 600 !important;
          }
          
          /* Forzar división de líneas en notas de sección */
          .minimalist-chart .section-notes-container {
            max-width: 100% !important;
            white-space: normal !important;
          }
          
          .minimalist-chart .section-notes-container div {
            white-space: normal !important;
            word-break: break-word !important;
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
          <div className="text-right text-sm text-gray-500 song-header-info">
            <div><span className="font-semibold">Página:</span> <span className="font-normal">{pageText}</span></div>
            <div>
              <span className="font-semibold">Tono:</span> <span className="font-normal">{song.key}</span> &nbsp;&nbsp; 
              <span className="font-semibold">Tempo:</span> <span className="font-normal">{song.tempo}</span> &nbsp;&nbsp; 
              <span className="font-semibold">Time:</span> <span className="font-normal">{song.timeSignature}</span>
            </div>
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
            
            // Function to extract repeat number from section content
            const getRepeatNumber = (sectionType: string): string | null => {
              if (!song.sections || !song.sections[sectionType]) return null;
              
              const section = song.sections[sectionType];
              // Check all lines for patterns like "X2", "X3", "X4", etc.
              for (const line of section.lines) {
                const content = `${line.chords || ''} ${line.lyrics || ''}`.trim();
                const match = content.match(/\bX(\d+)\b/i);
                if (match) {
                  return match[1]; // Return just the number
                }
              }
              return null;
            };
            
            const repeatNumber = getRepeatNumber(sectionType);
            
            return (
              <div 
                key={index}
                className="sequence-item relative"
                style={{ borderColor: circleColor }}
                title={sectionType}
              >
                {sectionType}
                {repeatNumber && (
                  <>
                    {/* White overlay to create gap effect */}
                    <div 
                      className="absolute bg-white"
                      style={{
                        top: '-1px',
                        right: '-1px',
                        width: '11px',
                        height: '11px',
                        borderRadius: '0 50% 0 0'
                      }}
                    />
                    <div 
                      className="absolute top-0 right-0 flex items-center justify-center text-xs font-bold"
                      style={{
                        color: "black",
                        fontSize: "0.65rem",
                        transform: "translate(22%, -22%)",
                        zIndex: 10
                      }}
                    >
                      {repeatNumber}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Song Content in Two Columns */}
        <div className="two-column-grid">
          <div className="column-content">
            {leftColumn.map((section) => (
              <MinimalistSongSection 
                key={`section-${section.sequenceIndex}-${section.lines?.[0]?.chords || 'empty'}`} 
                section={section} 
                showChords={showChords}
              />
            ))}
          </div>
          <div className="column-content">
            {rightColumn.map((section) => (
              <MinimalistSongSection 
                key={`section-${section.sequenceIndex}-${section.lines?.[0]?.chords || 'empty'}`} 
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
