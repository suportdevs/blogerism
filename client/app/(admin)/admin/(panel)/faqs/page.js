'use client';

import { HelpCircle } from 'lucide-react';
import CrudPage from '@/components/admin/CrudPage';
import { Badge } from '@/components/admin/ui';

export default function FaqsPage() {
  return (
    <CrudPage
      endpoint="/admin/faqs"
      title="FAQs"
      singular="FAQ"
      icon={HelpCircle}
      description="Questions shown on the FAQ page and in FAQ blocks."
      defaults={{ question: '', answer: '', category: 'General', order: 0, isActive: true }}
      columns={[
        { key: 'question', label: 'Question', render: (f) => <div className="max-w-xl"><div className="font-semibold text-ink-900 dark:text-white">{f.question}</div><div className="line-clamp-1 text-xs text-ink-400">{f.answer}</div></div> },
        { key: 'category', label: 'Group', render: (f) => <Badge>{f.category || 'General'}</Badge> },
        { key: 'order', label: 'Order' },
        { key: 'isActive', label: 'Visible' },
      ]}
      fields={[
        { name: 'question', label: 'Question', required: true },
        { name: 'answer', label: 'Answer', type: 'textarea', rows: 5, required: true },
        { name: 'category', label: 'Group', half: true, hint: 'FAQs are grouped by this on the FAQ page.' },
        { name: 'order', label: 'Sort order', type: 'number', half: true },
        { name: 'isActive', label: 'Visible on site', type: 'toggle' },
      ]}
    />
  );
}
