import { useEffect, useState } from 'react';
import { ensureAccessibleUrl, normalizeUrlScheme } from '@/lib/storage';

interface SafeImageProps {
  bucket: 'tricoscopia' | 'fotos-cliente';
  src: string;
  alt: string;
  className?: string;
}

export default function SafeImage({ bucket, src, alt, className }: SafeImageProps) {
  const [resolved, setResolved] = useState<string>(normalizeUrlScheme(src));

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const url = await ensureAccessibleUrl(bucket, src);
        if (mounted) setResolved(url);
      } catch {
        if (mounted) setResolved(normalizeUrlScheme(src));
      }
    })();
    return () => { mounted = false; };
  }, [bucket, src]);

  return (
    <img src={resolved} alt={alt} className={className} />
  );
}