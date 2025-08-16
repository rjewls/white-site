import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Crosshair, RotateCcw, Loader2 } from 'lucide-react';

interface FocalPoint {
  x: number; // 0-100 (percentage from left)
  y: number; // 0-100 (percentage from top)
}

interface ImageFocalPointSelectorProps {
  imageUrl: string;
  imageName: string;
  currentFocalPoint?: FocalPoint;
  isOpen: boolean;
  onClose: () => void;
  onSave: (focalPoint: FocalPoint) => Promise<void>;
}

export const ImageFocalPointSelector: React.FC<ImageFocalPointSelectorProps> = ({
  imageUrl,
  imageName,
  currentFocalPoint = { x: 50, y: 50 },
  isOpen,
  onClose,
  onSave
}) => {
  const [focalPoint, setFocalPoint] = useState<FocalPoint>(currentFocalPoint);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle clicking on the image to set focal point
  const handleImageClick = useCallback((event: React.MouseEvent<HTMLImageElement>) => {
    if (!imageRef.current || !containerRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    // Clamp values to 0-100 range
    const clampedX = Math.max(0, Math.min(100, x));
    const clampedY = Math.max(0, Math.min(100, y));

    setFocalPoint({ x: clampedX, y: clampedY });
  }, []);

  // Reset to center
  const handleReset = () => {
    setFocalPoint({ x: 50, y: 50 });
  };

  // Save and close
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(focalPoint);
      onClose();
    } catch (error) {
      console.error('Error saving focal point:', error);
      // Don't close on error, let user retry
    } finally {
      setIsSaving(false);
    }
  };

  // Get the CSS object-position value for preview
  const getObjectPosition = (fp: FocalPoint) => {
    return `${fp.x}% ${fp.y}%`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={isSaving ? undefined : onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        {/* Saving overlay */}
        {isSaving && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-lg">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-600" />
              <p className="text-sm text-gray-600">Saving focus point...</p>
            </div>
          </div>
        )}
        
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crosshair className="w-5 h-5" />
            Set Image Focus Point - {imageName}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Click on the image to choose which part should be visible when the image is cropped in product cards.
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Main image editor */}
          <div className="space-y-4">
            <div 
              ref={containerRef}
              className="relative border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-50"
              style={{ minHeight: '400px' }}
            >
              <img
                ref={imageRef}
                src={imageUrl}
                alt={imageName}
                className={`w-full h-auto ${isSaving ? 'cursor-wait' : 'cursor-crosshair'}`}
                onClick={isSaving ? undefined : handleImageClick}
                onLoad={() => setIsImageLoaded(true)}
                style={{ 
                  display: 'block',
                  maxHeight: '500px',
                  width: '100%',
                  objectFit: 'contain',
                  opacity: isSaving ? 0.7 : 1
                }}
              />
              
              {/* Focal point indicator */}
              {isImageLoaded && (
                <div
                  className={`absolute w-6 h-6 bg-blue-500 border-2 border-white rounded-full shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-1/2 z-10 ${isSaving ? 'opacity-50' : ''}`}
                  style={{
                    left: `${focalPoint.x}%`,
                    top: `${focalPoint.y}%`,
                  }}
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 absolute inset-0 m-auto text-white animate-spin" />
                  ) : (
                    <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75"></div>
                  )}
                </div>
              )}

              {/* Grid overlay to help with positioning */}
              <div className="absolute inset-0 pointer-events-none opacity-20">
                {/* Vertical lines */}
                <div className="absolute left-1/3 top-0 bottom-0 border-l border-gray-400"></div>
                <div className="absolute left-2/3 top-0 bottom-0 border-l border-gray-400"></div>
                {/* Horizontal lines */}
                <div className="absolute top-1/3 left-0 right-0 border-t border-gray-400"></div>
                <div className="absolute top-2/3 left-0 right-0 border-t border-gray-400"></div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Focus Point: {focalPoint.x.toFixed(1)}% horizontal, {focalPoint.y.toFixed(1)}% vertical
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleReset}
                disabled={isSaving}
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset to Center
              </Button>
            </div>
          </div>

          {/* Preview section */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Preview in Product Card:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Mobile preview */}
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground text-center">Mobile (4:3)</div>
                <div className="relative bg-white border rounded-lg overflow-hidden shadow-sm">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={imageUrl}
                      alt="Mobile preview"
                      className="w-full h-full object-cover"
                      style={{ objectPosition: getObjectPosition(focalPoint) }}
                    />
                  </div>
                  <div className="p-2">
                    <div className="text-xs text-gray-600 truncate">Product Name</div>
                    <div className="text-sm font-semibold">$99.99</div>
                  </div>
                </div>
              </div>

              {/* Desktop preview */}
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground text-center">Desktop (3:4)</div>
                <div className="relative bg-white border rounded-lg overflow-hidden shadow-sm">
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={imageUrl}
                      alt="Desktop preview"
                      className="w-full h-full object-cover"
                      style={{ objectPosition: getObjectPosition(focalPoint) }}
                    />
                  </div>
                  <div className="p-2">
                    <div className="text-xs text-gray-600 truncate">Product Name</div>
                    <div className="text-sm font-semibold">$99.99</div>
                  </div>
                </div>
              </div>

              {/* Square preview */}
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground text-center">Square (1:1)</div>
                <div className="relative bg-white border rounded-lg overflow-hidden shadow-sm">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={imageUrl}
                      alt="Square preview"
                      className="w-full h-full object-cover"
                      style={{ objectPosition: getObjectPosition(focalPoint) }}
                    />
                  </div>
                  <div className="p-2">
                    <div className="text-xs text-gray-600 truncate">Product Name</div>
                    <div className="text-sm font-semibold">$99.99</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={handleSave} 
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Focus Point'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageFocalPointSelector;
