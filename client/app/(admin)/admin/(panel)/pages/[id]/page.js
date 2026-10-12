'use client';

import PageBuilder from '@/components/admin/PageBuilder';

export default function EditPage({ params }) {
  return <PageBuilder id={params.id} />;
}
