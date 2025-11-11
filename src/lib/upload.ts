import { upload } from '@vercel/blob/client';

export const handleFileUpload = async (file: File, onProgress?: (percentage: number) => void): Promise<string> => {
  const timestamp = Date.now();
  const fileExtension = file.name.split('.').pop();
  const sanitizedFileName = file.name.replace(`.${fileExtension}`, '').replace(/[^a-zA-Z0-9-]/g, '_');
  const newFileName = `${sanitizedFileName}-${timestamp}.${fileExtension}`;

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