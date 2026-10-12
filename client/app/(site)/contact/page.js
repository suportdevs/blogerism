import { getBootstrap } from '@/lib/server';
import Blocks from '@/components/site/Blocks';

export const metadata = { title: 'Contact' };

export default async function ContactPage() {
  const { settings } = await getBootstrap();
  const { contact } = settings;
  const blocks = [
    { id: 'h', type: 'pageHeader', data: { title: 'Let’s talk', subtitle: 'Questions, partnerships or just saying hi — our inbox is always open.' }, style: { background: 'gradient', paddingY: 'md' } },
    { id: 'c', type: 'contactForm', data: { title: 'Send us a message', text: 'Fill out the form and our team will get back to you within 24 hours.', showInfo: true }, style: { paddingY: 'lg' } },
  ];
  return (
    <>
      <Blocks blocks={blocks} settings={settings} />
      {contact.mapEmbedUrl && (
        <div className="site-container pb-20">
          <iframe src={contact.mapEmbedUrl} className="h-96 w-full rounded-theme-lg border border-fg/10" loading="lazy" title="Map" />
        </div>
      )}
    </>
  );
}
