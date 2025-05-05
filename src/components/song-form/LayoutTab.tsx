
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LayoutType } from "@/types/song";

interface LayoutTabProps {
  currentLayout: LayoutType;
  onLayoutChange: (layout: LayoutType) => void;
}

const LayoutTab: React.FC<LayoutTabProps> = ({
  currentLayout,
  onLayoutChange,
}) => {
  return (
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
  );
};

export default LayoutTab;
