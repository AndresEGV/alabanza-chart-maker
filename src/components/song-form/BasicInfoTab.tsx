
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SongData } from "@/types/song";

interface BasicInfoTabProps {
  song: SongData;
  onFieldChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({ song, onFieldChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          name="title"
          value={song.title}
          onChange={onFieldChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="artist">Artista</Label>
        <Input
          id="artist"
          name="artist"
          value={song.artist}
          onChange={onFieldChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="key">Tono</Label>
        <Input
          id="key"
          name="key"
          value={song.key}
          onChange={onFieldChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="tempo">Tempo</Label>
        <Input
          id="tempo"
          name="tempo"
          value={song.tempo}
          onChange={onFieldChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="timeSignature">Compás</Label>
        <Input
          id="timeSignature"
          name="timeSignature"
          value={song.timeSignature}
          onChange={onFieldChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="composer">Compositor(es)</Label>
        <Input
          id="composer"
          name="composer"
          value={song.composer || ""}
          onChange={onFieldChange}
        />
      </div>
    </div>
  );
};

export default BasicInfoTab;
