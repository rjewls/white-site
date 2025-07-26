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
  const touchStartX = useRef(0);
  const touchCurrentX = useRef(0);

  // Defensive: ensure images is always an array of valid URLs
  const safeImages = Array.isArray(images)
    ? images.filter(img => typeof img === "string" && img.trim() !== "")
    : typeof images === "string"
      ? images.split(",").map(i => i.trim()).filter(Boolean)
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

  // Continuous auto-play animation
  useEffect(() => {
    if (autoPlay && images.length > 1 && !isPaused && !isDragging) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [autoPlay, images.length, isPaused, isDragging]);

  // Touch event handlers for swipe functionality
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchCurrentX.current = e.touches[0].clientX;
    setIsDragging(true);
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    touchCurrentX.current = e.touches[0].clientX;
    const diff = touchCurrentX.current - touchStartX.current;
    setDragOffset(diff);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    const diff = touchCurrentX.current - touchStartX.current;
    const threshold = 50; // Minimum swipe distance
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // Swiped right - go to previous
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      } else {
        // Swiped left - go to next
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }
    }
    
    setIsDragging(false);
    setDragOffset(0);
    setTimeout(() => setIsPaused(false), 500); // Resume auto-play after swipe
  };

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    setCurrentIndex(index);
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
  };

  const nextModalImage = () => {
    setModalImageIndex((prev) => (prev + 1) % images.length);
    resetModalZoom();
  };

  const prevModalImage = () => {
    setModalImageIndex((prev) => (prev - 1 + images.length) % images.length);
    resetModalZoom();
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
        // Pan the image when zoomed
        const deltaX = modalTouchCurrentX.current - modalTouchStartX.current;
        const deltaY = modalTouchCurrentY.current - modalTouchStartY.current;
        setModalPanX(deltaX);
        setModalPanY(deltaY);
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
        
        if (newZoom === 1) {
          setModalPanX(0);
          setModalPanY(0);
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
      if (deltaX > 0) {
        prevModalImage();
      } else {
        nextModalImage();
      }
    }
    
    setIsModalPanning(false);
  };

  // Mouse wheel zoom for modal
  const handleModalWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomDelta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.min(Math.max(modalZoom * zoomDelta, 0.5), 4);
    setModalZoom(newZoom);
    
    if (newZoom === 1) {
      setModalPanX(0);
      setModalPanY(0);
    }
  };

  if (!images.length) {
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
        className="relative aspect-square overflow-hidden rounded-lg bg-background group cursor-grab active:cursor-grabbing"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div 
          className={`flex h-full ${isDragging ? 'transition-none' : 'transition-transform duration-500 ease-out'}`}
          style={{ 
            transform: `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))` 
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {safeImages.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${title} ${index + 1}`}
              className="w-full h-full object-cover flex-shrink-0 select-none cursor-pointer"
              draggable={false}
              onClick={() => openModal(index)}
              onError={e => { e.currentTarget.src = "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&h=800&fit=crop"; }}
            />
          ))}
        </div>
        
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover-scale"
              onClick={prevSlide}
              disabled={isAnimating}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover-scale"
              onClick={nextSlide}
              disabled={isAnimating}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Dots Indicator */}
        {safeImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {safeImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentIndex 
                    ? 'bg-primary scale-125' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
                disabled={isAnimating}
              />
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
                currentIndex === index 
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
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <Button
              variant="outline"
              size="icon"
              className="absolute top-4 right-4 z-50 bg-background/80 backdrop-blur-sm hover-scale"
              onClick={closeModal}
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Modal Image */}
            <div
              className="flex items-center justify-center w-full h-full overflow-hidden"
              onTouchStart={handleModalTouchStart}
              onTouchMove={handleModalTouchMove}
              onTouchEnd={handleModalTouchEnd}
              onWheel={handleModalWheel}
            >
              <img
                src={safeImages[modalImageIndex] || "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&h=800&fit=crop"}
                alt={`${title} ${modalImageIndex + 1}`}
                className="max-w-full max-h-full object-contain transition-transform duration-200 select-none"
                style={{
                  transform: `scale(${modalZoom}) translate(${modalPanX / modalZoom}px, ${modalPanY / modalZoom}px)`,
                  cursor: modalZoom > 1 ? (isModalPanning ? 'grabbing' : 'grab') : 'default'
                }}
                draggable={false}
                onError={e => { e.currentTarget.src = "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&h=800&fit=crop"; }}
              />
            </div>

            {/* Modal Navigation */}
            {images.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover-scale"
                  onClick={prevModalImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover-scale"
                  onClick={nextModalImage}
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