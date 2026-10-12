'use client';

import { MessageSquareQuote, Star } from 'lucide-react';
import CrudPage from '@/components/admin/CrudPage';
import { Avatar } from '@/components/admin/ui';

export default function TestimonialsPage() {
  return (
    <CrudPage
      endpoint="/admin/testimonials"
      title="Testimonials"
      singular="Testimonial"
      icon={MessageSquareQuote}
      description="Social proof displayed by Testimonials blocks."
      defaults={{ name: '', position: '', company: '', avatar: '', content: '', rating: 5, order: 0, isActive: true }}
      columns={[
        { key: 'name', label: 'Person', render: (t) => <div className="flex items-center gap-3"><Avatar src={t.avatar} name={t.name} /><div><div className="font-semibold text-ink-900 dark:text-white">{t.name}</div><div className="text-xs text-ink-400">{[t.position, t.company].filter(Boolean).join(' · ')}</div></div></div> },
        { key: 'content', label: 'Quote', render: (t) => <p className="line-clamp-2 max-w-md text-sm">“{t.content}”</p> },
        { key: 'rating', label: 'Rating', render: (t) => <span className="flex">{Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />)}</span> },
        { key: 'isActive', label: 'Visible' },
      ]}
      fields={[
        { name: 'avatar', label: 'Photo', type: 'image' },
        { name: 'name', label: 'Name', required: true },
        { name: 'position', label: 'Position', half: true },
        { name: 'company', label: 'Company', half: true },
        { name: 'content', label: 'Testimonial', type: 'textarea', required: true },
        { name: 'rating', label: 'Rating', type: 'rating', half: true },
        { name: 'order', label: 'Sort order', type: 'number', half: true },
        { name: 'isActive', label: 'Visible on site', type: 'toggle' },
      ]}
    />
  );
}
