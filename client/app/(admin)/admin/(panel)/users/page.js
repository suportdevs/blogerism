'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2, MoreHorizontal, Pencil, Plus, Trash2, Users } from 'lucide-react';
import { api } from '@/lib/api';
import { useApi } from '@/lib/hooks';
import { formatDate, timeAgo } from '@/lib/utils';
import { useAuth } from '@/components/admin/AuthProvider';
import { ImageField } from '@/components/admin/Media';
import { Avatar, Badge, Dropdown, DropdownItem, EmptyState, Field, Modal, PageHeader, Pagination, SearchInput, Toggle, useConfirm } from '@/components/admin/ui';

const EMPTY = { name: '', email: '', password: '', roleId: '', avatar: '', bio: '', isActive: true };

export default function UsersPage() {
  const { user: me } = useAuth();
  const confirm = useConfirm();
  const [params, setParams] = useState({ page: 1, q: '', roleId: '' });
  const { data, loading, reload } = useApi('/admin/users', params);
  const { data: roles } = useApi('/admin/roles');
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const items = data?.items || [];

  const save = async () => {
    setSaving(true);
    const body = { ...form, roleId: Number(form.roleId) };
    try {
      if (form.id) {
        const { id, role, _count, lastLoginAt, createdAt, ...rest } = body; // eslint-disable-line no-unused-vars
        await api.put(`/admin/users/${id}`, rest);
      } else {
        await api.post('/admin/users', body);
      }
      toast.success(form.id ? 'User updated' : 'User created');
      setForm(null);
      reload();
    } catch (e) { toast.error(e.message); } finally { setSaving(false); }
  };

  const remove = async (u) => {
    if (!(await confirm({ title: `Delete ${u.name}?`, message: 'Their posts will be kept without an author.' }))) return;
    try {
      await api.del(`/admin/users/${u.id}`);
      toast.success('User deleted');
      reload();
    } catch (e) { toast.error(e.message); }
  };

  return (
    <>
      <PageHeader title="Users" description="Invite teammates and control what they can access." actions={<button onClick={() => setForm({ ...EMPTY, roleId: roles?.items.find((r) => !r.isSystem)?.id || '' })} className="a-btn-primary"><Plus className="h-4 w-4" />Add user</button>} />
      <div className="a-card overflow-hidden">
        <div className="flex flex-wrap gap-3 border-b border-ink-100 p-4 dark:border-white/5">
          <SearchInput value={params.q} onChange={(q) => setParams({ ...params, page: 1, q })} placeholder="Search by name or email…" className="w-full sm:w-72" />
          <select className="a-input w-48" value={params.roleId} onChange={(e) => setParams({ ...params, page: 1, roleId: e.target.value })}>
            <option value="">All roles</option>
            {roles?.items.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>
        <div className="a-scroll overflow-x-auto">
          <table className="a-table min-w-[760px]">
            <thead><tr><th>User</th><th>Role</th><th>Posts</th><th>Status</th><th>Last login</th><th>Joined</th><th className="w-12" /></tr></thead>
            <tbody className={loading ? 'opacity-60' : ''}>
              {items.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <Avatar src={u.avatar} name={u.name} />
                      <div><div className="flex items-center gap-2 font-semibold text-ink-900 dark:text-white">{u.name}{u.id === me.id && <Badge color="brand">You</Badge>}</div><div className="text-xs text-ink-400">{u.email}</div></div>
                    </div>
                  </td>
                  <td><Badge color={u.role.slug === 'super-admin' ? 'brand' : 'gray'}>{u.role.name}</Badge></td>
                  <td className="font-semibold">{u._count.posts}</td>
                  <td>{u.isActive ? <Badge color="green" dot>Active</Badge> : <Badge color="red" dot>Disabled</Badge>}</td>
                  <td className="text-xs">{u.lastLoginAt ? timeAgo(u.lastLoginAt) : 'Never'}</td>
                  <td className="text-xs">{formatDate(u.createdAt)}</td>
                  <td>
                    <Dropdown trigger={<button className="a-btn-ghost a-btn-icon h-8 w-8"><MoreHorizontal className="h-4 w-4" /></button>}>
                      <DropdownItem icon={Pencil} onClick={() => setForm({ ...EMPTY, ...u, roleId: u.role.id, password: '', avatar: u.avatar || '', bio: u.bio || '' })}>Edit</DropdownItem>
                      {u.id !== me.id && <DropdownItem icon={Trash2} danger onClick={() => remove(u)}>Delete</DropdownItem>}
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && !items.length && <EmptyState icon={Users} title="No users found" />}
        </div>
        <Pagination meta={data?.meta} onChange={(page) => setParams({ ...params, page })} />
      </div>

      <Modal open={!!form} onClose={() => setForm(null)} title={form?.id ? 'Edit user' : 'Add user'} footer={<><button className="a-btn-secondary" onClick={() => setForm(null)}>Cancel</button><button className="a-btn-primary" onClick={save} disabled={saving}>{saving && <Loader2 className="h-4 w-4 animate-spin" />}Save</button></>}>
        {form && (
          <div className="grid gap-4 sm:grid-cols-[112px_1fr]">
            <ImageField value={form.avatar} onChange={(v) => setForm({ ...form, avatar: v })} aspect="aspect-square" />
            <div className="space-y-4">
              <Field label="Full name" required><input className="a-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
              <Field label="Email" required><input type="email" className="a-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
            </div>
            <Field className="sm:col-span-2" label={form.id ? 'New password' : 'Password'} hint={form.id ? 'Leave blank to keep the current password.' : 'At least 8 characters.'} required={!form.id}>
              <input type="password" className="a-input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} autoComplete="new-password" />
            </Field>
            <Field className="sm:col-span-2" label="Role" required>
              <select className="a-input" value={form.roleId} onChange={(e) => setForm({ ...form, roleId: e.target.value })}>
                <option value="" disabled>Select a role</option>
                {roles?.items.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </Field>
            <Field className="sm:col-span-2" label="Bio"><textarea className="a-textarea" rows={2} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} /></Field>
            <Toggle className="sm:col-span-2" label="Active" description="Disabled users cannot sign in." checked={form.isActive} onChange={(v) => setForm({ ...form, isActive: v })} />
          </div>
        )}
      </Modal>
    </>
  );
}
