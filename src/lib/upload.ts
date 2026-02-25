import { upload } from '@vercel/blob/client';

export const handleFileUpload = async (file: File, onProgress?: (percentage: number) => void): Promise<string> => {
  const fileExtension = file.name.split('.').pop();
  const sanitizedFileName = file.name.replace(`.${fileExtension}`, '').replace(/[^a-zA-Z0-9-]/g, '_');
  
  // Create a unique 6-character short code
  const shortCode = Math.random().toString(36).substring(2, 8);
  const newFileName = `${sanitizedFileName}-${shortCode}.${fileExtension}`;

  const blob = await upload(
    newFileName,
    file,
    {
      access: 'public',
      handleUploadUrl: '/api/admin/upload',
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          onProgress(progressEvent.percentage);
        }
      },
    }
  );
  return blob.url;
};