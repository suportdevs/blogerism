'use client';

import { Suspense } from 'react';
import PostEditor from '@/components/admin/PostEditor';

export default function NewPostPage() {
  return <Suspense fallback={null}><PostEditor /></Suspense>;
}
