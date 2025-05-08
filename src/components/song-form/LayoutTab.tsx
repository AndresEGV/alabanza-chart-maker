
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
          variant={currentLayout === LayoutType.SINGLE_COLUMN ? "default" : "outline"}
          onClick={() => onLayoutChange(LayoutType.SINGLE_COLUMN)}
          className="h-40 flex flex-col justify-center items-center p-4"
        >
          <div className="w-full h-full border rounded"></div>
          <span className="mt-2">Una columna</span>
        </Button>
        
        <Button
          variant={currentLayout === LayoutType.MINIMALIST ? "default" : "outline"}
          onClick={() => onLayoutChange(LayoutType.MINIMALIST)}
          className="h-40 flex flex-col justify-center items-center p-4"
        >
          <div className="w-full h-full border rounded flex flex-col">
            <div className="h-6 border-b bg-slate-50 flex items-center px-2">
              <div className="w-4 h-4 rounded-full border-2 mr-2"></div>
              <div className="h-2 w-12 bg-slate-200 rounded"></div>
            </div>
            <div className="flex-1 p-2">
              <div className="h-2 w-full bg-slate-100 rounded mb-1"></div>
              <div className="h-2 w-3/4 bg-slate-100 rounded"></div>
            </div>
          </div>
          <span className="mt-2">Dos columnas</span>
        </Button>
      </div>
    </div>
  );
};

export default LayoutTab;
