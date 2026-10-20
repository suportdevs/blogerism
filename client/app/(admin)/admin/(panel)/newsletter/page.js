'use client';

import { Download, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import CrudPage from '@/components/admin/CrudPage';
import { Avatar } from '@/components/admin/ui';
import { formatDate } from '@/lib/utils';

// Server-side export of every subscriber (not just the current page).
const exportCsv = () => api.download('/admin/subscribers/export', 'subscribers.csv').catch((e) => toast.error(e.message));

export default function NewsletterPage() {
  return (
    <CrudPage
      endpoint="/admin/subscribers"
      title="Newsletter"
      singular="Subscriber"
      icon={Mail}
      description="People who signed up through newsletter forms on your site."
      defaults={{ email: '', name: '', isActive: true }}
      toolbar={() => <button onClick={exportCsv} className="a-btn-secondary"><Download className="h-4 w-4" />Export CSV</button>}
      columns={[
        { key: 'email', label: 'Subscriber', render: (s) => <div className="flex items-center gap-3"><Avatar name={s.name || s.email} size={32} /><div><div className="font-semibold text-ink-900 dark:text-white">{s.email}</div>{s.name && <div className="text-xs text-ink-400">{s.name}</div>}</div></div> },
        { key: 'createdAt', label: 'Subscribed', render: (s) => formatDate(s.createdAt) },
        { key: 'isActive', label: 'Active' },
      ]}
      fields={[
        { name: 'email', label: 'Email', type: 'email', required: true },
        { name: 'name', label: 'Name' },
        { name: 'isActive', label: 'Active subscription', type: 'toggle' },
      ]}
    />
  );
}
