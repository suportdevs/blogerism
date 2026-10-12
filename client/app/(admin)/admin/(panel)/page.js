'use client';

import Link from 'next/link';
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ArrowUpRight, Eye, FileText, Image as ImageIcon, Inbox, Mail, Newspaper, PenSquare, Plus, Palette, LayoutTemplate } from 'lucide-react';
import { useAuth } from '@/components/admin/AuthProvider';
import { Avatar, Card, PageLoader, StatusBadge } from '@/components/admin/ui';
import { useApi } from '@/lib/hooks';
import { compact, formatDate, timeAgo } from '@/lib/utils';

function StatCard({ icon: Icon, label, value, sub, gradient, href }) {
  return (
    <Link href={href} className="a-card group relative overflow-hidden p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-20 blur-2xl ${gradient}`} />
      <div className="flex items-start justify-between">
        <div className={`grid h-11 w-11 place-items-center rounded-xl text-white shadow-lg ${gradient}`}><Icon className="h-5 w-5" /></div>
        <ArrowUpRight className="h-4 w-4 text-ink-300 transition group-hover:text-brand-500" />
      </div>
      <div className="mt-4 text-3xl font-extrabold tracking-tight text-ink-900 dark:text-white">{value}</div>
      <div className="mt-0.5 flex items-center justify-between text-sm">
        <span className="font-medium text-ink-500">{label}</span>
        {sub && <span className="text-xs text-ink-400">{sub}</span>}
      </div>
    </Link>
  );
}

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-ink-200 bg-white px-3 py-2 text-xs shadow-xl dark:border-white/10 dark:bg-ink-850">
      <div className="mb-1 font-bold text-ink-900 dark:text-white">{formatDate(label)}</div>
      {payload.map((p) => <div key={p.dataKey} className="flex items-center gap-2" style={{ color: p.color }}><span className="h-2 w-2 rounded-full" style={{ background: p.color }} />{p.name}: <b>{p.value}</b></div>)}
    </div>
  );
};

export default function Dashboard() {
  const { user, can } = useAuth();
  const { data } = useApi('/admin/system/dashboard');
  if (!data) return <PageLoader />;
  const { stats, timeline, categories, topPosts, recentPosts, recentMessages, recentActivity } = data;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const quick = [
    { href: '/admin/posts/new', label: 'Write a post', icon: PenSquare, perm: 'posts' },
    { href: '/admin/pages/new', label: 'Build a page', icon: LayoutTemplate, perm: 'pages' },
    { href: '/admin/media', label: 'Upload media', icon: ImageIcon, perm: 'media' },
    { href: '/admin/appearance', label: 'Customize theme', icon: Palette, perm: 'appearance' },
  ].filter((q) => can(q.perm));

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-ink-950 p-6 text-white sm:p-8">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-500/40 blur-[90px]" />
        <div className="absolute -bottom-24 left-1/3 h-60 w-60 rounded-full bg-fuchsia-500/25 blur-[90px]" />
        <div className="absolute inset-0 opacity-[.06] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:36px_36px]" />
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-sm font-semibold text-brand-300">{formatDate(new Date(), { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">{greeting}, {user.name.split(' ')[0]} ✨</h1>
            <p className="mt-2 max-w-lg text-ink-300">Your content got <b className="text-white">{compact(stats.views)}</b> views in total. You have <b className="text-white">{stats.unread}</b> unread message{stats.unread === 1 ? '' : 's'} and <b className="text-white">{stats.drafts}</b> draft{stats.drafts === 1 ? '' : 's'} waiting.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {quick.map((q) => (
              <Link key={q.href} href={q.href} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm font-semibold backdrop-blur transition hover:border-white/25 hover:bg-white/10">
                <q.icon className="h-4 w-4 text-brand-300" />{q.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard href="/admin/posts" icon={Newspaper} label="Posts" value={stats.posts} sub={`${stats.published} published`} gradient="bg-gradient-to-br from-brand-400 to-brand-600" />
        <StatCard href="/admin/posts" icon={Eye} label="Total views" value={compact(stats.views)} sub="all time" gradient="bg-gradient-to-br from-sky-400 to-blue-600" />
        <StatCard href="/admin/newsletter" icon={Mail} label="Subscribers" value={stats.subscribers} sub="active" gradient="bg-gradient-to-br from-emerald-400 to-teal-600" />
        <StatCard href="/admin/contacts" icon={Inbox} label="Unread messages" value={stats.unread} sub={`${stats.pages} pages · ${stats.users} users`} gradient="bg-gradient-to-br from-amber-400 to-orange-600" />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2" title="Activity overview" description="New posts and newsletter sign-ups — last 30 days">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeline} margin={{ left: -24, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="gPosts" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6d5dfc" stopOpacity={0.35} /><stop offset="100%" stopColor="#6d5dfc" stopOpacity={0} /></linearGradient>
                  <linearGradient id="gSubs" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity={0.3} /><stop offset="100%" stopColor="#10b981" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-ink-200 dark:text-white/5" vertical={false} />
                <XAxis dataKey="day" tickFormatter={(d) => formatDate(d, { month: 'short', day: 'numeric' })} tick={{ fontSize: 11, fill: '#8e8ea8' }} axisLine={false} tickLine={false} minTickGap={24} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#8e8ea8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="subscribers" name="Subscribers" stroke="#10b981" strokeWidth={2.5} fill="url(#gSubs)" />
                <Area type="monotone" dataKey="posts" name="Posts" stroke="#6d5dfc" strokeWidth={2.5} fill="url(#gPosts)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Posts by category">
          <div className="relative h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categories} dataKey="value" nameKey="name" innerRadius={58} outerRadius={84} paddingAngle={3} stroke="none">
                  {categories.map((c) => <Cell key={c.name} fill={c.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
              <div><div className="text-2xl font-extrabold text-ink-900 dark:text-white">{stats.posts}</div><div className="text-xs text-ink-400">posts</div></div>
            </div>
          </div>
          <ul className="mt-4 space-y-2">
            {categories.map((c) => (
              <li key={c.name} className="flex items-center gap-2.5 text-sm">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.color }} />
                <span className="flex-1 font-medium">{c.name}</span>
                <span className="font-bold text-ink-900 dark:text-white">{c.value}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card title="Top performing" bodyClassName="p-2" actions={<Link href="/admin/posts" className="text-xs font-semibold text-brand-600">View all</Link>}>
          {topPosts.map((p, i) => (
            <Link key={p.id} href={`/admin/posts/${p.id}`} className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-ink-50 dark:hover:bg-white/5">
              <span className="w-5 text-center text-sm font-extrabold text-ink-300">{i + 1}</span>
              {p.coverImage ? <img src={p.coverImage} alt="" className="h-10 w-14 rounded-lg object-cover" /> : <div className="h-10 w-14 rounded-lg bg-ink-100" />}
              <span className="line-clamp-2 flex-1 text-sm font-semibold">{p.title}</span>
              <span className="flex items-center gap-1 text-xs font-bold text-ink-500"><Eye className="h-3.5 w-3.5" />{compact(p.views)}</span>
            </Link>
          ))}
        </Card>

        <Card title="Recent posts" bodyClassName="p-2" actions={can('posts') && <Link href="/admin/posts/new" className="a-btn-secondary h-8 px-2.5 text-xs"><Plus className="h-3.5 w-3.5" />New</Link>}>
          {recentPosts.map((p) => (
            <Link key={p.id} href={`/admin/posts/${p.id}`} className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-ink-50 dark:hover:bg-white/5">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-500 dark:bg-brand-500/10"><FileText className="h-4 w-4" /></div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">{p.title}</div>
                <div className="text-xs text-ink-400">{p.author?.name} · {timeAgo(p.createdAt)}</div>
              </div>
              <StatusBadge status={p.status} />
            </Link>
          ))}
        </Card>

        <Card title="Latest activity" bodyClassName="p-5">
          <ol className="relative space-y-5 border-l border-ink-100 pl-5 dark:border-white/10">
            {recentActivity.map((a) => (
              <li key={a.id} className="relative">
                <span className="absolute -left-[27px] top-0.5 ring-4 ring-white dark:ring-ink-900"><Avatar src={a.user?.avatar} name={a.user?.name || 'System'} size={22} /></span>
                <p className="text-sm"><b className="text-ink-900 dark:text-white">{a.user?.name || 'System'}</b> <span className="text-ink-500">{a.description.charAt(0).toLowerCase() + a.description.slice(1)}</span></p>
                <p className="text-xs text-ink-400">{timeAgo(a.createdAt)}</p>
              </li>
            ))}
          </ol>
        </Card>
      </div>

      {can('contacts') && recentMessages.length > 0 && (
        <Card title="Inbox" description="Latest contact form submissions" bodyClassName="p-0" actions={<Link href="/admin/contacts" className="text-xs font-semibold text-brand-600">Open inbox</Link>}>
          <div className="divide-y divide-ink-100 dark:divide-white/5">
            {recentMessages.map((m) => (
              <Link key={m.id} href="/admin/contacts" className="flex items-center gap-4 px-5 py-3.5 transition hover:bg-ink-50 dark:hover:bg-white/[.02]">
                <Avatar name={m.name} size={36} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2"><span className="font-semibold text-ink-900 dark:text-white">{m.name}</span><span className="text-xs text-ink-400">{m.email}</span></div>
                  <p className="truncate text-sm text-ink-500"><b className="font-semibold text-ink-700 dark:text-ink-300">{m.subject}</b> — {m.message}</p>
                </div>
                <StatusBadge status={m.status} />
                <span className="hidden text-xs text-ink-400 sm:block">{timeAgo(m.createdAt)}</span>
              </Link>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
