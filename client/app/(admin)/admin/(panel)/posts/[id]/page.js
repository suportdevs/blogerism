'use client';

import { Suspense } from 'react';
import PostEditor from '@/components/admin/PostEditor';

export default function EditPostPage({ params }) {
  return <Suspense fallback={null}><PostEditor id={params.id} /></Suspense>;
}
