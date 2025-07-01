
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";

interface SequenceTabProps {
  sequenceInput: string;
  onSequenceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  availableSections: string[];
}

const SequenceTab: React.FC<SequenceTabProps> = ({
  sequenceInput,
  onSequenceChange,
  availableSections,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="sequence">Secuencia de secciones</Label>
        <div className="text-sm text-muted-foreground mb-2 flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          <span>Ingrese la secuencia separando con espacios (ej: "I V1 C1 V2 C1 B F")</span>
        </div>
        <Input
          id="sequence"
          value={sequenceInput}
          onChange={onSequenceChange}
          placeholder="I V1 C1 V2 C1 B F"
        />
        
        
        <div className="mt-4 p-4 border rounded-md bg-slate-50">
          <div className="font-semibold mb-2">Secciones disponibles:</div>
          <div className="flex flex-wrap gap-2">
            {availableSections.map((type) => (
              <span key={type} className="px-2 py-1 bg-white border rounded text-sm">
                {type}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SequenceTab;
