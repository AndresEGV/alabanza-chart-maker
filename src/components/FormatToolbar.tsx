import React from 'react';
import { Button } from '@/components/ui/button';
import { Bold, Italic } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface FormatToolbarProps {
  onFormat: (format: 'bold' | 'italic') => void;
  disabled?: boolean;
}

const FormatToolbar: React.FC<FormatToolbarProps> = ({ onFormat, disabled = false }) => {
  return (
    <TooltipProvider>
      <div className="flex gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onFormat('bold')}
              disabled={disabled}
              className="h-8 w-8 p-0"
            >
              <Bold className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Negrita (selecciona texto y haz clic)</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onFormat('italic')}
              disabled={disabled}
              className="h-8 w-8 p-0"
            >
              <Italic className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Cursiva (selecciona texto y haz clic)</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default FormatToolbar;