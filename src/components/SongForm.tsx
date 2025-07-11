import React, { useState, useEffect } from "react";
import { LayoutType, SectionType, SongData } from "../types/song";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Save, Loader2 } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { parseChordLyricTextInput, convertChordLyricLinesToText } from "@/utils/chordParser";

// Import sub-components
import BasicInfoTab from "./song-form/BasicInfoTab";
import SectionsTab from "./song-form/SectionsTab";
import SequenceTab from "./song-form/SequenceTab";
import LayoutTab from "./song-form/LayoutTab";
import NewSectionDialog from "./song-form/NewSectionDialog";

interface SongFormProps {
  initialSong: SongData;
  onSongUpdate: (song: SongData) => void | Promise<void>;
  onLayoutChange: (layout: LayoutType) => void;
  currentLayout: LayoutType | null;
}

const SongForm: React.FC<SongFormProps> = ({
  initialSong,
  onSongUpdate,
  onLayoutChange,
  currentLayout,
}) => {
  const { user } = useAuthStore();
  const [song, setSong] = useState<SongData>(initialSong);
  const [activeSectionTab, setActiveSectionTab] = useState<SectionType>("I");
  const [sectionText, setSectionText] = useState<Record<SectionType, string>>({} as Record<SectionType, string>);
  const [sequenceInput, setSequenceInput] = useState<string>(
    initialSong.sectionSequence.join(" ")
  );
  const [newSectionDialogOpen, setNewSectionDialogOpen] = useState(false);
  const [newSectionCode, setNewSectionCode] = useState("");
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Initialize section text from song data when the component mounts or the song changes
  useEffect(() => {
    const initialSectionText: Record<SectionType, string> = {} as Record<SectionType, string>;
    
    Object.entries(initialSong.sections).forEach(([type, section]) => {
      // Use our helper function to correctly preserve exact formatting without extra spacing
      if (section.lines && section.lines.length > 0) {
        const textWithoutExtraSpacing = convertChordLyricLinesToText(section.lines);
        initialSectionText[type as SectionType] = textWithoutExtraSpacing;
      } else {
        initialSectionText[type as SectionType] = "";
      }
    });
    
    setSectionText(initialSectionText);
    
    // Set the first available section as active if the current one doesn't exist
    if (!initialSong.sections[activeSectionTab] && Object.keys(initialSong.sections).length > 0) {
      setActiveSectionTab(Object.keys(initialSong.sections)[0] as SectionType);
    }
  }, [initialSong]);

  const handleBasicInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSong((prev) => ({ ...prev, [name]: value }));
  };

  const handleSectionTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setSectionText(prev => ({
      ...prev,
      [activeSectionTab]: value
    }));
  };

  const handleSequenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSequenceInput(e.target.value);
    const sequence = e.target.value.split(/\s+/).filter(Boolean) as SectionType[];
    setSong(prev => ({
      ...prev,
      sectionSequence: sequence
    }));
  };

  const handleAddSection = () => {
    if (!newSectionCode || !newSectionTitle) return;
    
    // Add the new section type to the song sections
    const sectionCode = newSectionCode as SectionType;
    
    setSong(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionCode]: {
          type: sectionCode,
          title: newSectionTitle,
          lines: [{ chords: "", lyrics: "" }]
        }
      }
    }));
    
    // Add empty text for the new section
    setSectionText(prev => ({
      ...prev,
      [sectionCode]: ""
    }));
    
    // Set the new section as active
    setActiveSectionTab(sectionCode);
    
    // Reset form fields
    setNewSectionCode("");
    setNewSectionTitle("");
    setNewSectionDialogOpen(false);
  };

  const handleDeleteSection = (sectionType: SectionType) => {
    // Cannot delete if it's the only section
    if (Object.keys(song.sections).length <= 1) return;
    
    // Create a new sections object without the deleted section
    const { [sectionType]: removedSection, ...remainingSections } = song.sections;
    
    // Update the sequence by removing the deleted section
    const updatedSequence = song.sectionSequence.filter(type => type !== sectionType);
    
    // Set a new active section if the current one is being deleted
    if (activeSectionTab === sectionType) {
      const firstRemainingSection = Object.keys(remainingSections)[0] as SectionType;
      setActiveSectionTab(firstRemainingSection);
    }
    
    // Update the song state
    setSong(prev => ({
      ...prev,
      sections: remainingSections,
      sectionSequence: updatedSequence
    }));
    
    // Update the sequence input
    setSequenceInput(updatedSequence.join(" "));
    
    // Remove the section from the text state
    const { [sectionType]: removedText, ...remainingText } = sectionText;
    setSectionText(remainingText as Record<SectionType, string>);
  };

  const handleAddNote = (note: { text: string; position: "left" | "right" }) => {
    if (!note.text) return;
    
    setSong(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        [activeSectionTab]: {
          ...prev.sections[activeSectionTab],
          notes: [
            ...(prev.sections[activeSectionTab].notes || []),
            note
          ]
        }
      }
    }));
  };

  const handleDeleteNote = (noteIndex: number) => {
    setSong(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        [activeSectionTab]: {
          ...prev.sections[activeSectionTab],
          notes: prev.sections[activeSectionTab].notes?.filter((_, i) => i !== noteIndex)
        }
      }
    }));
  };

  // Validation function
  const isFormValid = (): boolean => {
    // Check if title is provided
    if (!song.title || song.title.trim() === '') {
      return false;
    }
    
    // Check if at least one section has content
    const hasContent = Object.values(sectionText).some(text => text && text.trim() !== '');
    if (!hasContent) {
      return false;
    }
    
    // Check if sequence is valid
    const sequence = sequenceInput.split(/\s+/).filter(Boolean);
    if (sequence.length === 0) {
      return false;
    }
    
    // Check if layout is selected
    if (!currentLayout) {
      return false;
    }
    
    return true;
  };

  // Get validation message
  const getValidationMessage = (): string => {
    const missing: string[] = [];
    
    if (!song.title || song.title.trim() === '') {
      missing.push('Título de la canción');
    }
    
    const hasContent = Object.values(sectionText).some(text => text && text.trim() !== '');
    if (!hasContent) {
      missing.push('Contenido en al menos una sección');
    }
    
    const sequence = sequenceInput.split(/\s+/).filter(Boolean);
    if (sequence.length === 0) {
      missing.push('Secuencia de secciones');
    }
    
    if (!currentLayout) {
      missing.push('Diseño de página');
    }
    
    if (missing.length === 0) return '';
    
    return `Para generar la guía necesitas completar: ${missing.join(', ')}`;
  };

  // Check if each tab has valid content
  const isBasicInfoValid = (): boolean => {
    return !!(song.title && song.title.trim() !== '');
  };

  const isSectionsValid = (): boolean => {
    return Object.values(sectionText).some(text => text && text.trim() !== '');
  };

  const isSequenceValid = (): boolean => {
    const sequence = sequenceInput.split(/\s+/).filter(Boolean);
    return sequence.length > 0;
  };

  const isLayoutValid = (): boolean => {
    return !!currentLayout;
  };

  const handleGenerateChart = async () => {
    setIsGenerating(true);
    
    // Simulate processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 300));
    
    try {
      // Parse section text into chord-lyric pairs, preserving exact formatting
      const updatedSections = { ...song.sections };
      
      Object.entries(sectionText).forEach(([type, text]) => {
        if (text && text.trim()) {
          // Parse the text into ChordLyricLine objects
          const lines = parseChordLyricTextInput(text);
          
          if (updatedSections[type as SectionType]) {
            updatedSections[type as SectionType] = {
              ...updatedSections[type as SectionType],
              lines
            };
          }
        }
      });
      
      const updatedSong = {
        ...song,
        sections: updatedSections,
        sectionSequence: sequenceInput.split(/\s+/).filter(Boolean) as SectionType[]
      };
      
      await onSongUpdate(updatedSong);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4 sm:p-6">
        {!isFormValid() && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              💡 Completa todos los campos requeridos (<span className="text-red-500">*</span>) en cada pestaña para generar tu guía
            </p>
          </div>
        )}
        <Tabs defaultValue="basic" className={`w-full ${isGenerating ? 'opacity-60 pointer-events-none' : ''}`}>
          <div className="overflow-x-auto -mx-2 px-2 sm:mx-0 sm:px-0">
            <TabsList className="mb-4 w-max sm:w-full">
              <TabsTrigger value="basic" className="text-xs sm:text-sm">
                Información básica{!isBasicInfoValid() && <span className="text-red-500 ml-0.5">*</span>}
              </TabsTrigger>
              <TabsTrigger value="sections" className="text-xs sm:text-sm">
                Secciones{!isSectionsValid() && <span className="text-red-500 ml-0.5">*</span>}
              </TabsTrigger>
              <TabsTrigger value="sequence" className="text-xs sm:text-sm">
                Secuencia{!isSequenceValid() && <span className="text-red-500 ml-0.5">*</span>}
              </TabsTrigger>
              <TabsTrigger value="layout" className="text-xs sm:text-sm">
                Diseño{!isLayoutValid() && <span className="text-red-500 ml-0.5">*</span>}
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="basic">
            <BasicInfoTab song={song} onFieldChange={handleBasicInfoChange} />
          </TabsContent>
          
          <TabsContent value="sections">
            <SectionsTab 
              song={song}
              activeSectionTab={activeSectionTab}
              sectionText={sectionText}
              onSectionSelect={setActiveSectionTab}
              onDeleteSection={handleDeleteSection}
              onAddSectionClick={() => setNewSectionDialogOpen(true)}
              onSectionTextChange={handleSectionTextChange}
              onAddNote={handleAddNote}
              onDeleteNote={handleDeleteNote}
            />
          </TabsContent>
          
          <TabsContent value="sequence">
            <SequenceTab 
              sequenceInput={sequenceInput}
              onSequenceChange={handleSequenceChange}
              availableSections={Object.keys(song.sections)}
            />
          </TabsContent>
          
          <TabsContent value="layout">
            <LayoutTab 
              currentLayout={currentLayout}
              onLayoutChange={onLayoutChange}
            />
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 flex justify-end">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Button 
                    onClick={handleGenerateChart}
                    disabled={!isFormValid() || isGenerating}
                    className="gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generando...
                      </>
                    ) : (
                      <>
                        {user && <Save className="h-4 w-4" />}
                        Generar {user ? 'y Guardar' : ''} Guía
                      </>
                    )}
                  </Button>
                </div>
              </TooltipTrigger>
              {!isFormValid() && !isGenerating && (
                <TooltipContent>
                  <p className="text-sm max-w-xs">{getValidationMessage()}</p>
                </TooltipContent>
              )}
              {isFormValid() && user && !isGenerating && (
                <TooltipContent>
                  <p className="text-sm">La guía se guardará automáticamente al generarla</p>
                </TooltipContent>
              )}
              {isGenerating && (
                <TooltipContent>
                  <p className="text-sm">Procesando tu guía...</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>

        <NewSectionDialog
          open={newSectionDialogOpen}
          onOpenChange={setNewSectionDialogOpen}
          newSectionCode={newSectionCode}
          setNewSectionCode={setNewSectionCode}
          newSectionTitle={newSectionTitle}
          setNewSectionTitle={setNewSectionTitle}
          onAddSection={handleAddSection}
        />
      </CardContent>
    </Card>
  );
};

export default SongForm;
