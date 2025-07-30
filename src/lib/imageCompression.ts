/**
 * Image compression utility to convert images to WebP format
 * and compress them to a target size of 100-200 KB
 */

export interface CompressionOptions {
  maxSizeKB?: number;
  minSizeKB?: number;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
}

const DEFAULT_OPTIONS: Required<CompressionOptions> = {
  maxSizeKB: 200,
  minSizeKB: 100,
  maxWidth: 1200,
  maxHeight: 1200,
  quality: 0.8,
  format: 'webp'
};

/**
 * Compresses an image file to WebP format with target size
 * @param file - The input image file
 * @param options - Compression options
 * @returns Promise<File> - The compressed WebP file
 */
export const compressImage = async (
  file: File,
  options: CompressionOptions = {}
): Promise<File> => {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  return new Promise((resolve, reject) => {
    // Create a canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    // Create an image element
    const img = new Image();
    
    img.onload = () => {
      try {
        // Calculate new dimensions while maintaining aspect ratio
        const { width: newWidth, height: newHeight } = calculateDimensions(
          img.width,
          img.height,
          opts.maxWidth,
          opts.maxHeight
        );
        
        // Set canvas dimensions
        canvas.width = newWidth;
        canvas.height = newHeight;
        
        // Draw the image on canvas with new dimensions
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
        
        // Try different quality levels to achieve target size
        compressToTargetSize(canvas, opts, file.name)
          .then(resolve)
          .catch(reject);
          
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    // Load the image
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Calculate new dimensions while maintaining aspect ratio
 */
const calculateDimensions = (
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } => {
  let { width, height } = { width: originalWidth, height: originalHeight };
  
  // Scale down if too large
  if (width > maxWidth) {
    height = (height * maxWidth) / width;
    width = maxWidth;
  }
  
  if (height > maxHeight) {
    width = (width * maxHeight) / height;
    height = maxHeight;
  }
  
  return { width: Math.round(width), height: Math.round(height) };
};

/**
 * Compress canvas to target file size
 */
const compressToTargetSize = async (
  canvas: HTMLCanvasElement,
  options: Required<CompressionOptions>,
  originalName: string
): Promise<File> => {
  const { maxSizeKB, minSizeKB, quality: initialQuality, format } = options;
  
  let currentQuality = initialQuality;
  let attempts = 0;
  const maxAttempts = 10;
  
  while (attempts < maxAttempts) {
    const blob = await canvasToBlob(canvas, format, currentQuality);
    const sizeKB = blob.size / 1024;
    
    console.log(`Compression attempt ${attempts + 1}: ${sizeKB.toFixed(1)}KB at quality ${currentQuality.toFixed(2)}`);
    
    // If size is within target range, we're done
    if (sizeKB >= minSizeKB && sizeKB <= maxSizeKB) {
      return blobToFile(blob, originalName, format);
    }
    
    // If size is too large, reduce quality
    if (sizeKB > maxSizeKB) {
      currentQuality *= 0.8; // Reduce quality by 20%
      if (currentQuality < 0.1) {
        // If quality is too low, we'll accept this size
        return blobToFile(blob, originalName, format);
      }
    } 
    // If size is too small and we have room to increase quality
    else if (sizeKB < minSizeKB && currentQuality < 0.95) {
      currentQuality = Math.min(currentQuality * 1.1, 0.95); // Increase quality by 10%
    } 
    // If size is smaller than minimum but quality is already high, accept it
    else {
      return blobToFile(blob, originalName, format);
    }
    
    attempts++;
  }
  
  // If we couldn't achieve target size, return the last attempt
  const finalBlob = await canvasToBlob(canvas, format, currentQuality);
  return blobToFile(finalBlob, originalName, format);
};

/**
 * Convert canvas to blob with specified format and quality
 */
const canvasToBlob = (
  canvas: HTMLCanvasElement,
  format: string,
  quality: number
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob from canvas'));
        }
      },
      `image/${format}`,
      quality
    );
  });
};

/**
 * Convert blob to File with appropriate name and type
 */
const blobToFile = (blob: Blob, originalName: string, format: string): File => {
  // Generate new filename with WebP extension
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
  const newName = `${nameWithoutExt}.${format}`;
  
  return new File([blob], newName, {
    type: `image/${format}`,
    lastModified: Date.now()
  });
};

/**
 * Batch compress multiple images
 * @param files - Array of image files to compress
 * @param options - Compression options
 * @param onProgress - Progress callback (optional)
 * @returns Promise<File[]> - Array of compressed files
 */
export const compressImages = async (
  files: File[],
  options: CompressionOptions = {},
  onProgress?: (progress: number, currentFile: string) => void
): Promise<File[]> => {
  const compressedFiles: File[] = [];
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    try {
      // Call progress callback if provided
      if (onProgress) {
        onProgress((i / files.length) * 100, file.name);
      }
      
      const compressedFile = await compressImage(file, options);
      compressedFiles.push(compressedFile);
      
      console.log(`Compressed ${file.name}: ${(file.size / 1024).toFixed(1)}KB → ${(compressedFile.size / 1024).toFixed(1)}KB`);
      
    } catch (error) {
      console.error(`Failed to compress ${file.name}:`, error);
      // If compression fails, use original file but log the error
      compressedFiles.push(file);
    }
  }
  
  // Final progress update
  if (onProgress) {
    onProgress(100, 'Complete');
  }
  
  return compressedFiles;
};

/**
 * Check if the browser supports WebP format
 * @returns boolean
 */
export const supportsWebP = (): boolean => {
  const canvas = document.createElement('canvas');
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
};

/**
 * Get file size in human readable format
 * @param bytes - Size in bytes
 * @returns string - Formatted size (e.g., "1.2 MB", "256 KB")
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};
