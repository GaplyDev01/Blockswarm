import React, { useEffect, useState } from 'react';

interface ImageStatus {
  path: string;
  exists: boolean;
  error?: string;
}

export const ImageDebugTool: React.FC = () => {
  const [imageStatuses, setImageStatuses] = useState<ImageStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Image paths to test
  const imagePaths = [
    '/assets/db1.png',
    '/assets/db2.png',
    '/assets/db3.png',
    '/assets/db4.png',
    './assets/db1.png',
    './assets/db2.png',
    './assets/db3.png',
    './assets/db4.png',
  ];

  // Check if images exist
  useEffect(() => {
    const checkImages = async () => {
      setIsLoading(true);
      
      const statuses = await Promise.all(
        imagePaths.map(async (path) => {
          try {
            const response = await fetch(path, { method: 'HEAD' });
            return {
              path,
              exists: response.ok,
              error: response.ok ? undefined : `Status: ${response.status}`
            };
          } catch (error) {
            return {
              path,
              exists: false,
              error: error instanceof Error ? error.message : 'Unknown error'
            };
          }
        })
      );
      
      setImageStatuses(statuses);
      setIsLoading(false);
    };
    
    checkImages();
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black/80 backdrop-blur-sm p-4 rounded-lg border border-viridian/50 shadow-lg text-white max-w-md">
      <h3 className="text-viridian font-bold mb-2">Image Debug Tool</h3>
      {isLoading ? (
        <p>Checking image paths...</p>
      ) : (
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {imageStatuses.map((status, idx) => (
            <div key={idx} className={`p-2 rounded ${status.exists ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
              <p className="text-sm font-medium">{status.path}</p>
              <p className={`text-xs ${status.exists ? 'text-green-400' : 'text-red-400'}`}>
                {status.exists ? 'Available' : `Failed: ${status.error}`}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};