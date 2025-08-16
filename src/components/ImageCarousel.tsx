import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface ImageCarouselProps {
  images: string[];
  title: string;
  autoPlay?: boolean;
  showThumbnails?: boolean;
}

const ImageCarousel = ({ images, title, autoPlay = true, showThumbnails = true }: ImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const touchStartX = useRef(0);
  const touchCurrentX = useRef(0);
  
  // Check if we're in RTL mode
  const isRTL = document.documentElement.dir === 'rtl';

  // Defensive: ensure images is always an array of valid URLs
  const safeImages = Array.isArray(images)
    ? images.filter(img => typeof img === "string" && img.trim() !== "")
    : typeof images === "string" && images
      ? (images as string).split(",").map(i => i.trim()).filter(Boolean)
      : [];
  
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  
  // Modal zoom and pan state
  const [modalZoom, setModalZoom] = useState(1);
  const [modalPanX, setModalPanX] = useState(0);
  const [modalPanY, setModalPanY] = useState(0);
  const [isModalPanning, setIsModalPanning] = useState(false);
  const modalTouchStartX = useRef(0);
  const modalTouchStartY = useRef(0);
  const modalTouchCurrentX = useRef(0);
  const modalTouchCurrentY = useRef(0);
  const modalLastTouchDistance = useRef(0);
  const modalLastTapTime = useRef(0);
  // Keep track of accumulated pan position for smooth dragging
  const modalPanStartX = useRef(0);
  const modalPanStartY = useRef(0);
  // Direct reference to the image element for instant transform updates
  const modalImageRef = useRef<HTMLImageElement>(null);
  // Current pan position during drag (for immediate visual feedback)
  const currentPanX = useRef(0);
  const currentPanY = useRef(0);

  // For infinite loop effect, we'll duplicate first and last images
  const extendedImages = safeImages.length > 1 
    ? [safeImages[safeImages.length - 1], ...safeImages, safeImages[0]]
    : safeImages;
  
  // Adjust current index for extended array (add 1 because we added one image at the start)
  const [displayIndex, setDisplayIndex] = useState(safeImages.length > 1 ? 1 : 0);
  const [actualIndex, setActualIndex] = useState(0);

  // Continuous auto-play animation that starts immediately
  useEffect(() => {
    if (autoPlay && safeImages.length > 1 && !isDragging && !isPaused) {
      const interval = setInterval(() => {
        setDisplayIndex(prev => prev + 1);
        setActualIndex(prev => (prev + 1) % safeImages.length);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [autoPlay, safeImages.length, isDragging, isPaused]);

  // Handle infinite loop transitions
  useEffect(() => {
    if (safeImages.length <= 1) return;
    
    // When we reach the duplicate first image at the end
    if (displayIndex === extendedImages.length - 1) {
      const timer = setTimeout(() => {
        setIsTransitioning(false); // Disable transition
        setDisplayIndex(1); // Jump to real first image
        setCurrentIndex(0);
        // Re-enable transition on next frame
        requestAnimationFrame(() => {
          setIsTransitioning(true);
        });
      }, 700); // Wait for transition to complete
      return () => clearTimeout(timer);
    }
    // When we reach the duplicate last image at the beginning
    else if (displayIndex === 0) {
      const timer = setTimeout(() => {
        setIsTransitioning(false); // Disable transition
        setDisplayIndex(extendedImages.length - 2); // Jump to real last image
        setCurrentIndex(safeImages.length - 1);
        // Re-enable transition on next frame
        requestAnimationFrame(() => {
          setIsTransitioning(true);
        });
      }, 700);
      return () => clearTimeout(timer);
    } else {
      // Update current index normally
      setCurrentIndex(displayIndex - 1);
    }
  }, [displayIndex, extendedImages.length, safeImages.length]);

  // Override isPaused behavior - only pause during active user interaction
  useEffect(() => {
    // Reset pause state after user stops interacting
    if (isPaused && !isDragging) {
      const timer = setTimeout(() => {
        setIsPaused(false);
      }, 1000); // Resume after 1 second of no interaction
      return () => clearTimeout(timer);
    }
  }, [isPaused, isDragging]);

  // Sync current pan refs with state when modal opens or image changes
  useEffect(() => {
    if (isModalOpen) {
      currentPanX.current = modalPanX;
      currentPanY.current = modalPanY;
    }
  }, [isModalOpen, modalImageIndex, modalPanX, modalPanY]);

  // Touch event handlers for swipe functionality
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchCurrentX.current = e.touches[0].clientX;
    setIsDragging(true);
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault(); // Prevent scrolling while dragging
    touchCurrentX.current = e.touches[0].clientX;
    const diff = touchCurrentX.current - touchStartX.current;
    // Limit drag distance to prevent excessive movement
    const maxDrag = 100;
    // In RTL mode, reverse the drag offset direction
    const limitedDiff = Math.max(-maxDrag, Math.min(maxDrag, isRTL ? -diff : diff));
    setDragOffset(limitedDiff);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    const diff = touchCurrentX.current - touchStartX.current;
    const threshold = 50; // Minimum swipe distance
    
    if (Math.abs(diff) > threshold) {
      // In RTL mode, reverse the swipe direction logic
      if (isRTL) {
        if (diff > 0) {
          // Swiped right in RTL - go to next
          const nextIndex = (actualIndex + 1) % safeImages.length;
          setDisplayIndex(nextIndex + 1);
          setActualIndex(nextIndex);
        } else {
          // Swiped left in RTL - go to previous
          const prevIndex = (actualIndex - 1 + safeImages.length) % safeImages.length;
          setDisplayIndex(prevIndex + 1);
          setActualIndex(prevIndex);
        }
      } else {
        if (diff > 0) {
          // Swiped right in LTR - go to previous
          const prevIndex = (actualIndex - 1 + safeImages.length) % safeImages.length;
          setDisplayIndex(prevIndex + 1);
          setActualIndex(prevIndex);
        } else {
          // Swiped left in LTR - go to next
          const nextIndex = (actualIndex + 1) % safeImages.length;
          setDisplayIndex(nextIndex + 1);
          setActualIndex(nextIndex);
        }
      }
    }
    
    // Always reset drag state
    setIsDragging(false);
    setDragOffset(0);
    // Resume auto-play after a brief delay
    setTimeout(() => setIsPaused(false), 1000);
  };

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % safeImages.length);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const goToSlide = (index: number) => {
    if (isAnimating || index === actualIndex) return;
    setIsAnimating(true);
    setDisplayIndex(index + 1); // Add 1 because of the duplicate image at the start
    setActualIndex(index);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const openModal = (index: number) => {
    setModalImageIndex(index);
    setIsModalOpen(true);
    setIsPaused(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsPaused(false);
    resetModalZoom();
  };

  const resetModalZoom = () => {
    setModalZoom(1);
    setModalPanX(0);
    setModalPanY(0);
    currentPanX.current = 0;
    currentPanY.current = 0;
    if (modalImageRef.current) {
      modalImageRef.current.style.transform = `scale(1) translate(0px, 0px)`;
    }
  };

  const nextModalImage = () => {
    setModalImageIndex((prev) => (prev + 1) % safeImages.length);
    resetModalZoom();
  };

  const prevModalImage = () => {
    setModalImageIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length);
    resetModalZoom();
  };

  // Helper function to update image transform immediately
  const updateImageTransform = (zoom: number, panX: number, panY: number) => {
    if (modalImageRef.current) {
      modalImageRef.current.style.transform = `scale(${zoom}) translate(${panX / zoom}px, ${panY / zoom}px)`;
    }
  };

  // Modal touch event handlers
  const handleModalTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      // Single touch - check for double tap or start panning
      const now = Date.now();
      const timeSinceLastTap = now - modalLastTapTime.current;
      
      if (timeSinceLastTap < 300) {
        // Double tap - toggle zoom
        if (modalZoom === 1) {
          setModalZoom(2);
        } else {
          resetModalZoom();
        }
        return;
      }
      
      modalLastTapTime.current = now;
      modalTouchStartX.current = e.touches[0].clientX;
      modalTouchStartY.current = e.touches[0].clientY;
      modalTouchCurrentX.current = e.touches[0].clientX;
      modalTouchCurrentY.current = e.touches[0].clientY;
      
      // Store the current pan position when starting to drag
      modalPanStartX.current = modalPanX;
      modalPanStartY.current = modalPanY;
      currentPanX.current = modalPanX;
      currentPanY.current = modalPanY;
      setIsModalPanning(true);
    } else if (e.touches.length === 2) {
      // Pinch zoom
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) + 
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      modalLastTouchDistance.current = distance;
    }
  };

  const handleModalTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isModalPanning) {
      modalTouchCurrentX.current = e.touches[0].clientX;
      modalTouchCurrentY.current = e.touches[0].clientY;
      
      if (modalZoom > 1) {
        // Pan the image when zoomed - accumulate position from the starting point
        const deltaX = modalTouchCurrentX.current - modalTouchStartX.current;
        const deltaY = modalTouchCurrentY.current - modalTouchStartY.current;
        
        // Update current pan position and apply transform immediately
        currentPanX.current = modalPanStartX.current + deltaX;
        currentPanY.current = modalPanStartY.current + deltaY;
        
        // Apply transform immediately for instant feedback
        updateImageTransform(modalZoom, currentPanX.current, currentPanY.current);
        
        // Also update state for consistency (but this might be slightly delayed)
        setModalPanX(currentPanX.current);
        setModalPanY(currentPanY.current);
      }
    } else if (e.touches.length === 2) {
      // Pinch zoom
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) + 
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      
      if (modalLastTouchDistance.current > 0) {
        const scale = distance / modalLastTouchDistance.current;
        const newZoom = Math.min(Math.max(modalZoom * scale, 0.5), 4);
        setModalZoom(newZoom);
        
        // If zoomed all the way out, center the image
        if (Math.abs(newZoom - 1) < 0.01) {
          setModalPanX(0);
          setModalPanY(0);
          currentPanX.current = 0;
          currentPanY.current = 0;
          updateImageTransform(newZoom, 0, 0);
        } else {
          updateImageTransform(newZoom, currentPanX.current, currentPanY.current);
        }
      }
      
      modalLastTouchDistance.current = distance;
    }
  };

  const handleModalTouchEnd = () => {
    if (!isModalPanning) return;
    
    const deltaX = modalTouchCurrentX.current - modalTouchStartX.current;
    const deltaY = modalTouchCurrentY.current - modalTouchStartY.current;
    const threshold = 50;
    
    // If not zoomed and horizontal swipe is significant, navigate
    if (modalZoom === 1 && Math.abs(deltaX) > threshold && Math.abs(deltaX) > Math.abs(deltaY)) {
      // In RTL mode, reverse the swipe direction logic
      if (isRTL) {
        if (deltaX > 0) {
          nextModalImage();
        } else {
          prevModalImage();
        }
      } else {
        if (deltaX > 0) {
          prevModalImage();
        } else {
          nextModalImage();
        }
      }
    }
    
    // Sync the final position
    setModalPanX(currentPanX.current);
    setModalPanY(currentPanY.current);
    
    setIsModalPanning(false);
  };

  // Mouse wheel zoom for modal
  const handleModalWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomDelta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.min(Math.max(modalZoom * zoomDelta, 0.5), 4);
    setModalZoom(newZoom);
    
    // If zoomed all the way out, center the image
    if (Math.abs(newZoom - 1) < 0.01) {
      setModalPanX(0);
      setModalPanY(0);
      currentPanX.current = 0;
      currentPanY.current = 0;
      updateImageTransform(newZoom, 0, 0);
    } else {
      updateImageTransform(newZoom, currentPanX.current, currentPanY.current);
    }
  };

  if (!safeImages.length) {
    return (
      <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">No images available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image Carousel */}
      <div 
        className="relative aspect-square overflow-hidden rounded-lg bg-background group cursor-grab active:cursor-grabbing border-2 border-primary shadow-lg lg:transition-all lg:duration-300"
        style={{ touchAction: 'pan-y' }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
      >
        <div 
          className={`flex h-full ${isDragging || !isTransitioning ? 'transition-none' : 'transition-transform duration-700 ease-in-out'}`}
          style={{ 
            transform: isRTL 
              ? `translateX(calc(${displayIndex * 100}% - ${dragOffset}px))` 
              : `translateX(calc(-${displayIndex * 100}% + ${dragOffset}px))`,
            willChange: isDragging ? 'transform' : 'auto',
            direction: isRTL ? 'rtl' : 'ltr'
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {extendedImages.map((image, index) => {
            return (
              <img
                key={`extended-${index}`}
                src={image}
                alt={`${title} ${index + 1}`}
                className="w-full h-full object-cover flex-shrink-0 select-none cursor-pointer"
                draggable={false}
                onLoad={(e) => {
                  console.log('ImageCarousel - Image loaded successfully:', image);
                  console.log('ImageCarousel - Image element:', e.currentTarget);
                }}
                onError={(e) => { 
                  console.error('ImageCarousel - Image failed to load:', image);
                  e.currentTarget.src = "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&h=800&fit=crop"; 
                }}
                onClick={() => {
                  // Calculate the actual image index for modal
                  const actualImageIndex = index === 0 
                    ? safeImages.length - 1  // Last image duplicate
                    : index === extendedImages.length - 1 
                      ? 0  // First image duplicate
                      : index - 1;  // Normal images
                  openModal(actualImageIndex);
                }}
              />
            );
          })}
        </div>
        
        // Navigation arrows removed from main carousel (thumbnails below are used for navigation)

        {/* Dots Indicator with progress animation */}
        {safeImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {safeImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`relative w-2 h-2 rounded-full transition-all duration-300 ${
                  index === actualIndex 
                    ? 'bg-primary scale-125' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
                disabled={isAnimating}
              >
                {/* Auto-play progress indicator for current slide */}
                {index === currentIndex && autoPlay && !isPaused && !isDragging && (
                  <div 
                    className="absolute inset-0 rounded-full border-2 border-white/80"
                    style={{
                      animation: 'progress 2.5s linear infinite'
                    }}
                  />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {showThumbnails && safeImages.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
            {safeImages.map((image, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`aspect-square overflow-hidden rounded-lg border-2 transition-all duration-200 hover-scale ${
                actualIndex === index 
                  ? 'border-primary shadow-lg scale-105' 
                  : 'border-transparent hover:border-primary/50'
              }`}
              disabled={isAnimating}
            >
              <img
                src={image}
                alt={`${title} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                onError={e => { e.currentTarget.src = "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&h=800&fit=crop"; }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Full-Screen Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-none w-screen h-screen p-0 bg-black/95 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center overflow-visible">
            {/* Close Button - positioned lower for mobile devices */}
            <button
              type="button"
              aria-label="Close fullscreen"
              onClick={closeModal}
              className="absolute top-8 right-4 z-50 bg-white/90 rounded-full p-3 shadow-lg border border-gray-300 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary md:top-4"
              style={{ width: 56, height: 56, right: 16 }}
            >
              <X className="h-7 w-7 text-black" />
            </button>

            {/* Modal Image */}
            <div
              className="flex items-center justify-center w-full h-full overflow-hidden"
              onTouchStart={handleModalTouchStart}
              onTouchMove={handleModalTouchMove}
              onTouchEnd={handleModalTouchEnd}
              onWheel={handleModalWheel}
              onMouseDown={e => {
                if (modalZoom > 1) {
                  setIsModalPanning(true);
                  modalTouchStartX.current = e.clientX;
                  modalTouchStartY.current = e.clientY;
                  modalTouchCurrentX.current = e.clientX;
                  modalTouchCurrentY.current = e.clientY;
                  
                  // Store the current pan position when starting to drag
                  modalPanStartX.current = modalPanX;
                  modalPanStartY.current = modalPanY;
                  currentPanX.current = modalPanX;
                  currentPanY.current = modalPanY;
                }
              }}
              onMouseMove={e => {
                if (modalZoom > 1 && isModalPanning) {
                  modalTouchCurrentX.current = e.clientX;
                  modalTouchCurrentY.current = e.clientY;
                  const deltaX = modalTouchCurrentX.current - modalTouchStartX.current;
                  const deltaY = modalTouchCurrentY.current - modalTouchStartY.current;
                  
                  // Update current pan position and apply transform immediately
                  currentPanX.current = modalPanStartX.current + deltaX;
                  currentPanY.current = modalPanStartY.current + deltaY;
                  
                  // Apply transform immediately for instant feedback
                  updateImageTransform(modalZoom, currentPanX.current, currentPanY.current);
                  
                  // Also update state for consistency (but this might be slightly delayed)
                  setModalPanX(currentPanX.current);
                  setModalPanY(currentPanY.current);
                }
              }}
              onMouseUp={() => {
                // Sync the final position
                setModalPanX(currentPanX.current);
                setModalPanY(currentPanY.current);
                setIsModalPanning(false);
              }}
              onMouseLeave={() => {
                // Sync the final position
                setModalPanX(currentPanX.current);
                setModalPanY(currentPanY.current);
                setIsModalPanning(false);
              }}
            >
              <img
                ref={modalImageRef}
                src={safeImages[modalImageIndex] || "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&h=800&fit=crop"}
                alt={`${title} ${modalImageIndex + 1}`}
                className="max-w-full max-h-full object-contain select-none"
                style={{
                  transform: `scale(${modalZoom}) translate(${modalPanX / modalZoom}px, ${modalPanY / modalZoom}px)`,
                  cursor: modalZoom > 1 ? (isModalPanning ? 'grabbing' : 'grab') : 'default',
                  willChange: isModalPanning ? 'transform' : 'auto'
                }}
                draggable={false}
                onError={e => { e.currentTarget.src = "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&h=800&fit=crop"; }}
              />
            </div>

            {/* Modal Navigation */}
        {safeImages.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover-scale"
                  onClick={isRTL ? nextModalImage : prevModalImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover-scale"
                  style={{ right: 16 }}
                  onClick={isRTL ? prevModalImage : nextModalImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>

                {/* Modal Dots Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                  {safeImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setModalImageIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-200 ${
                        index === modalImageIndex 
                          ? 'bg-white scale-125' 
                          : 'bg-white/50 hover:bg-white/70'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImageCarousel;