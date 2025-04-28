
import React, { useState } from "react";
import { LayoutType, SectionType, SongData, SongSection as SongSectionType } from "../types/song";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { parseChordLyricTextInput } from "@/utils/songUtils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, Info } from "lucide-react";

interface SongFormProps {
  initialSong: SongData;
  onSongUpdate: (song: SongData) => void;
  onLayoutChange: (layout: LayoutType) => void;
  currentLayout: LayoutType;
}

const SongForm: React.FC<SongFormProps> = ({
  initialSong,
  onSongUpdate,
  onLayoutChange,
  currentLayout,
}) => {
  const [song, setSong] = useState<SongData>(initialSong);
  const [activeSectionTab, setActiveSectionTab] = useState<SectionType>("I");
  const [sectionText, setSectionText] = useState<Record<SectionType, string>>({} as Record<SectionType, string>);
  const [sequenceInput, setSequenceInput] = useState<string>(
    initialSong.sectionSequence.join(" ")
  );

  // Initialize section text from song data
  React.useEffect(() => {
    const initialSectionText: Record<SectionType, string> = {} as Record<SectionType, string>;
    
    Object.entries(initialSong.sections).forEach(([type, section]) => {
      const lines = section.lines.map(line => `${line.chords}\n${line.lyrics}`).join('\n\n');
      initialSectionText[type as SectionType] = lines;
    });
    
    setSectionText(initialSectionText);
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

  const handleGenerateChart = () => {
    // Parse section text into chord-lyric pairs
    const updatedSections = { ...song.sections };
    
    Object.entries(sectionText).forEach(([type, text]) => {
      const lines = parseChordLyricTextInput(text);
      updatedSections[type as SectionType] = {
        ...updatedSections[type as SectionType],
        lines
      };
    });
    
    const updatedSong = {
      ...song,
      sections: updatedSections,
      sectionSequence: sequenceInput.split(/\s+/).filter(Boolean) as SectionType[]
    };
    
    onSongUpdate(updatedSong);
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="basic">Información básica</TabsTrigger>
            <TabsTrigger value="sections">Secciones</TabsTrigger>
            <TabsTrigger value="sequence">Secuencia</TabsTrigger>
            <TabsTrigger value="layout">Diseño</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  name="title"
                  value={song.title}
                  onChange={handleBasicInfoChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="artist">Artista</Label>
                <Input
                  id="artist"
                  name="artist"
                  value={song.artist}
                  onChange={handleBasicInfoChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="key">Tono</Label>
                <Input
                  id="key"
                  name="key"
                  value={song.key}
                  onChange={handleBasicInfoChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tempo">Tempo</Label>
                <Input
                  id="tempo"
                  name="tempo"
                  value={song.tempo}
                  onChange={handleBasicInfoChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timeSignature">Compás</Label>
                <Input
                  id="timeSignature"
                  name="timeSignature"
                  value={song.timeSignature}
                  onChange={handleBasicInfoChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="composer">Compositor(es)</Label>
                <Input
                  id="composer"
                  name="composer"
                  value={song.composer || ""}
                  onChange={handleBasicInfoChange}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="sections" className="space-y-4">
            <div className="flex overflow-x-auto py-2 mb-2 gap-1">
              {Object.keys(song.sections).map((type) => (
                <Button
                  key={type}
                  variant={activeSectionTab === type ? "default" : "outline"}
                  onClick={() => setActiveSectionTab(type as SectionType)}
                  className="flex-shrink-0"
                >
                  {type}
                </Button>
              ))}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="sectionText">Acordes y Letra</Label>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Info className="h-3 w-3 mr-1" />
                  Escribir acordes en una línea y letra en la siguiente
                </div>
              </div>
              
              <ScrollArea className="h-96 border rounded-md p-4">
                <Textarea
                  id="sectionText"
                  className="min-h-[300px] font-mono"
                  value={sectionText[activeSectionTab] || ""}
                  onChange={handleSectionTextChange}
                  placeholder={`G\nMil generaciones\n\nC            G2\nSe postran adorarle`}
                />
              </ScrollArea>
            </div>
          </TabsContent>
          
          <TabsContent value="sequence" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sequence">Secuencia de secciones</Label>
              <div className="text-sm text-muted-foreground mb-2 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                Ingrese la secuencia separando con espacios (ej: "I V1 C1 V2 C1 B F")
              </div>
              <Input
                id="sequence"
                value={sequenceInput}
                onChange={handleSequenceChange}
                placeholder="I V1 C1 V2 C1 B F"
              />
              
              <div className="mt-4 p-4 border rounded-md bg-slate-50">
                <div className="font-semibold mb-2">Secciones disponibles:</div>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(song.sections).map((type) => (
                    <span key={type} className="px-2 py-1 bg-white border rounded text-sm">
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="layout" className="space-y-4">
            <div className="space-y-4">
              <Label className="block mb-2">Diseño de la página</Label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  variant={currentLayout === LayoutType.TWO_COLUMN ? "default" : "outline"}
                  onClick={() => onLayoutChange(LayoutType.TWO_COLUMN)}
                  className="h-40 flex flex-col justify-center items-center p-4"
                >
                  <div className="w-full h-full border rounded flex">
                    <div className="border-r w-1/2"></div>
                    <div className="w-1/2"></div>
                  </div>
                  <span className="mt-2">Dos columnas</span>
                </Button>
                
                <Button
                  variant={currentLayout === LayoutType.SINGLE_COLUMN ? "default" : "outline"}
                  onClick={() => onLayoutChange(LayoutType.SINGLE_COLUMN)}
                  className="h-40 flex flex-col justify-center items-center p-4"
                >
                  <div className="w-full h-full border rounded"></div>
                  <span className="mt-2">Una columna</span>
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 flex justify-end">
          <Button onClick={handleGenerateChart}>Generar Guía</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SongForm;
