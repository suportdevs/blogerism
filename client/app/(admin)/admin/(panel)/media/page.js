'use client';

import { MediaLibrary } from '@/components/admin/Media';
import { PageHeader } from '@/components/admin/ui';

export default function MediaPage() {
  return (
    <>
      <PageHeader title="Media library" description="Upload, organize and reuse images, videos and documents. Drag & drop anywhere to upload." />
      <MediaLibrary />
    </>
  );
}
