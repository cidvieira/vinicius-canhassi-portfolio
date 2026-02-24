import imageCompression from 'browser-image-compression';

export interface OptimizationOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  useWebWorker?: boolean;
}

const DEFAULT_OPTIONS: OptimizationOptions = {
  maxSizeMB: 0.5,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
};

/**
 * Compresses an image and converts it to WebP format.
 * @param file The image file to optimize.
 * @param options Optimization options.
 * @returns A promise that resolves to the optimized File object.
 */
export async function optimizeImage(
  file: File,
  options: OptimizationOptions = DEFAULT_OPTIONS
): Promise<File> {
  // If it's not an image, return original file (should be handled by validation as well)
  if (!file.type.startsWith('image/')) {
    return file;
  }

  try {
    const compressionOptions = {
      maxSizeMB: options.maxSizeMB || DEFAULT_OPTIONS.maxSizeMB,
      maxWidthOrHeight: options.maxWidthOrHeight || DEFAULT_OPTIONS.maxWidthOrHeight,
      useWebWorker: options.useWebWorker ?? DEFAULT_OPTIONS.useWebWorker,
      fileType: 'image/webp',
    };

    const compressedBlob = await imageCompression(file, compressionOptions);
    
    // Convert blob to File object and ensure .webp extension
    const fileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
    return new File([compressedBlob], fileName, {
      type: 'image/webp',
      lastModified: Date.now(),
    });
  } catch (error) {
    console.error('Error optimizing image:', error);
    // Return original file if optimization fails
    return file;
  }
}

/**
 * Validates if a file is an image and within size limits.
 * @param file The file to validate.
 * @param maxSizeMB Maximum allowed size in MB (before optimization).
 * @returns An error message or null if valid.
 */
export function validateImage(file: File, maxSizeMB: number = 10): string | null {
  if (!file.type.startsWith('image/')) {
    return 'O arquivo selecionado não é uma imagem.';
  }
  
  const sizeInMB = file.size / (1024 * 1024);
  if (sizeInMB > maxSizeMB) {
    return `A imagem é muito grande. O limite máximo é de ${maxSizeMB}MB.`;
  }
  
  return null;
}
