'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { KeyRound, Loader2, Save } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/components/admin/AuthProvider';
import { ImageField } from '@/components/admin/Media';
import { Badge, Card, Field, PageHeader } from '@/components/admin/ui';
import { formatDate } from '@/lib/utils';

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: user.name, email: user.email, avatar: user.avatar || '', bio: user.bio || '' });
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [saving, setSaving] = useState(false);
  const [savingPw, setSavingPw] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { user: u } = await api.put('/auth/me', form);
      setUser(u);
      toast.success('Profile updated');
    } catch (err) { toast.error(err.message); } finally { setSaving(false); }
  };

  const changePw = async (e) => {
    e.preventDefault();
    if (pw.newPassword !== pw.confirm) { toast.error('Passwords do not match'); return; }
    setSavingPw(true);
    try {
      await api.put('/auth/me/password', { currentPassword: pw.currentPassword, newPassword: pw.newPassword });
      setPw({ currentPassword: '', newPassword: '', confirm: '' });
      toast.success('Password changed');
    } catch (err) { toast.error(err.message); } finally { setSavingPw(false); }
  };

  return (
    <>
      <PageHeader title="My profile" description="Your personal details and security." />
      <div className="grid items-start gap-6 lg:grid-cols-[1fr_380px]">
        <Card title="Personal information">
          <form onSubmit={save} className="grid gap-5 sm:grid-cols-[140px_1fr]">
            <div>
              <ImageField value={form.avatar} onChange={(v) => setForm({ ...form, avatar: v })} aspect="aspect-square" />
              <div className="mt-3 text-center"><Badge color="brand">{user.role.name}</Badge></div>
            </div>
            <div className="space-y-4">
              <Field label="Full name"><input className="a-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
              <Field label="Email"><input type="email" className="a-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
              <Field label="Bio" hint="Shown in the author box under your posts."><textarea className="a-textarea" rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} /></Field>
              <div className="flex items-center justify-between">
                <span className="text-xs text-ink-400">Member since {formatDate(user.createdAt)}</span>
                <button className="a-btn-primary" disabled={saving}>{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}Save profile</button>
              </div>
            </div>
          </form>
        </Card>
        <Card title={<span className="flex items-center gap-2"><KeyRound className="h-4 w-4" />Change password</span>}>
          <form onSubmit={changePw} className="space-y-4">
            <Field label="Current password"><input type="password" className="a-input" value={pw.currentPassword} onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} required /></Field>
            <Field label="New password" hint="At least 8 characters."><input type="password" className="a-input" value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} required minLength={8} /></Field>
            <Field label="Confirm new password"><input type="password" className="a-input" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} required /></Field>
            <button className="a-btn-primary w-full" disabled={savingPw}>{savingPw && <Loader2 className="h-4 w-4 animate-spin" />}Update password</button>
          </form>
        </Card>
      </div>
    </>
  );
}
