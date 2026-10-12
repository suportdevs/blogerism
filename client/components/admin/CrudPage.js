'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2, MoreHorizontal, Pencil, Plus, Star, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useApi, useSelection } from '@/lib/hooks';
import { cn } from '@/lib/utils';
import { ImageField } from './Media';
import { Checkbox, Dropdown, DropdownItem, EmptyState, Field, Modal, PageHeader, Pagination, SearchInput, Toggle, useConfirm } from './ui';

function FormField({ field, value, onChange }) {
  switch (field.type) {
    case 'textarea':
      return <textarea className="a-textarea" rows={field.rows || 4} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />;
    case 'number':
      return <input type="number" className="a-input" value={value ?? 0} onChange={(e) => onChange(Number(e.target.value))} />;
    case 'toggle':
      return <Toggle checked={!!value} onChange={onChange} label={field.toggleLabel} />;
    case 'image':
      return <ImageField value={value} onChange={onChange} aspect="aspect-square w-28" />;
    case 'select':
      return (
        <select className="a-input" value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
          {field.options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      );
    case 'rating':
      return (
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button type="button" key={n} onClick={() => onChange(n)}><Star className={cn('h-6 w-6', n <= value ? 'fill-amber-400 text-amber-400' : 'text-ink-300')} /></button>
          ))}
        </div>
      );
    default:
      return <input type={field.type || 'text'} className="a-input" value={value ?? ''} onChange={(e) => onChange(e.target.value)} />;
  }
}

/**
 * Generic list + modal form page for simple resources.
 * config: { endpoint, title, description, singular, icon, columns, fields, defaults, toolbar }
 */
export default function CrudPage({ endpoint, title, description, singular, icon, columns, fields, defaults, toolbar, sortable }) {
  const confirm = useConfirm();
  const [params, setParams] = useState({ page: 1, q: '' });
  const { data, loading, reload } = useApi(endpoint, params);
  const items = data?.items || [];
  const sel = useSelection(items);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const openNew = () => setEditing({ ...defaults });
  const save = async (e) => {
    e?.preventDefault();
    setSaving(true);
    const { id, createdAt, updatedAt, _count, ...body } = editing; // eslint-disable-line no-unused-vars
    try {
      if (id) await api.put(`${endpoint}/${id}`, body);
      else await api.post(endpoint, body);
      toast.success(`${singular} ${id ? 'updated' : 'created'}`);
      setEditing(null);
      reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (ids) => {
    if (!(await confirm({ title: `Delete ${ids.length > 1 ? `${ids.length} items` : `this ${singular.toLowerCase()}`}?` }))) return;
    if (ids.length === 1) await api.del(`${endpoint}/${ids[0]}`);
    else await api.post(`${endpoint}/bulk-delete`, { ids });
    toast.success('Deleted');
    sel.clear();
    reload();
  };

  const toggleActive = async (item) => {
    await api.put(`${endpoint}/${item.id}`, { isActive: !item.isActive });
    reload();
  };

  return (
    <>
      <PageHeader title={title} description={description} actions={<>{toolbar?.({ items, reload })}<button onClick={openNew} className="a-btn-primary"><Plus className="h-4 w-4" />Add {singular.toLowerCase()}</button></>} />
      <div className="a-card overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 border-b border-ink-100 p-4 dark:border-white/5">
          <SearchInput value={params.q} onChange={(q) => setParams({ page: 1, q })} className="w-full sm:w-72" />
          {sel.selected.length > 0 && <button onClick={() => remove(sel.selected)} className="a-btn-danger ml-auto"><Trash2 className="h-4 w-4" />Delete {sel.selected.length}</button>}
        </div>
        <div className="a-scroll overflow-x-auto">
          <table className="a-table">
            <thead>
              <tr>
                <th className="w-10"><Checkbox checked={sel.allSelected} indeterminate={sel.someSelected} onChange={sel.toggleAll} /></th>
                {columns.map((c) => <th key={c.key} className={c.className}>{c.label}</th>)}
                <th className="w-12" />
              </tr>
            </thead>
            <tbody className={loading ? 'opacity-60' : ''}>
              {items.map((item) => (
                <tr key={item.id}>
                  <td><Checkbox checked={sel.isSelected(item.id)} onChange={() => sel.toggle(item.id)} /></td>
                  {columns.map((c) => (
                    <td key={c.key} className={c.className} onClick={c.clickable !== false && c.key !== 'isActive' ? () => setEditing(item) : undefined}>
                      {c.key === 'isActive'
                        ? <Toggle checked={item.isActive} onChange={() => toggleActive(item)} />
                        : c.render ? c.render(item) : item[c.key]}
                    </td>
                  ))}
                  <td>
                    <Dropdown trigger={<button className="a-btn-ghost a-btn-icon h-8 w-8"><MoreHorizontal className="h-4 w-4" /></button>}>
                      <DropdownItem icon={Pencil} onClick={() => setEditing(item)}>Edit</DropdownItem>
                      <DropdownItem icon={Trash2} danger onClick={() => remove([item.id])}>Delete</DropdownItem>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && !items.length && <EmptyState icon={icon} title={`No ${title.toLowerCase()} yet`} action={<button onClick={openNew} className="a-btn-primary"><Plus className="h-4 w-4" />Add {singular.toLowerCase()}</button>} />}
        </div>
        <Pagination meta={data?.meta} onChange={(page) => setParams((s) => ({ ...s, page }))} />
      </div>

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? `Edit ${singular.toLowerCase()}` : `New ${singular.toLowerCase()}`}
        footer={<><button className="a-btn-secondary" onClick={() => setEditing(null)}>Cancel</button><button className="a-btn-primary" onClick={save} disabled={saving}>{saving && <Loader2 className="h-4 w-4 animate-spin" />}Save</button></>}
      >
        {editing && (
          <form onSubmit={save} className="grid grid-cols-2 gap-4">
            {fields.map((f) => (
              <Field key={f.name} label={f.type === 'toggle' ? null : f.label} hint={f.hint} required={f.required} className={f.half ? 'col-span-2 sm:col-span-1' : 'col-span-2'}>
                {f.type === 'toggle'
                  ? <Toggle label={f.label} description={f.hint} checked={!!editing[f.name]} onChange={(v) => setEditing({ ...editing, [f.name]: v })} />
                  : <FormField field={f} value={editing[f.name]} onChange={(v) => setEditing({ ...editing, [f.name]: v })} />}
              </Field>
            ))}
            <button type="submit" hidden />
          </form>
        )}
      </Modal>
    </>
  );
}
