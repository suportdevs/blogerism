import { Bookmark } from 'lucide-react';
import { getBootstrap } from '@/lib/server';
import { saveLabels } from '@/lib/engagement';
import { SavedList } from '@/components/site/Engagement';

export async function generateMetadata() {
  const { theme } = await getBootstrap();
  return { title: saveLabels(theme).page, robots: { index: false } };
}

// Items the visitor saved (stored in their browser).
export default async function SavedPage() {
  const { theme } = await getBootstrap();
  const labels = saveLabels(theme);
  return (
    <div className="site-container py-14 sm:py-20">
      <div className="mb-10 flex items-center gap-4">
        <span className="grid h-14 w-14 place-items-center rounded-theme-lg bg-primary/10 text-primary"><Bookmark className="h-6 w-6" /></span>
        <div>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">{labels.page}</h1>
          <p className="mt-1 text-fg/55">Saved on this device — no account needed.</p>
        </div>
      </div>
      <SavedList labels={labels} />
    </div>
  );
}
