'use client';

import { Download, Mail } from 'lucide-react';
import { api } from '@/lib/api';
import CrudPage from '@/components/admin/CrudPage';
import { Avatar } from '@/components/admin/ui';
import { formatDate } from '@/lib/utils';

async function exportCsv() {
  const { items } = await api.get('/admin/subscribers', { limit: 100, page: 1 });
  const rows = [['email', 'name', 'active', 'subscribed_at'], ...items.map((s) => [s.email, s.name || '', s.isActive, s.createdAt])];
  const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  a.download = `subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
}

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
