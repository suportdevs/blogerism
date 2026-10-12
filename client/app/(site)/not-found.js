import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <section className="relative overflow-hidden py-32 text-center">
      <div className="pointer-events-none absolute left-1/2 top-10 h-80 w-[600px] -translate-x-1/2 rounded-full bg-primary/20 blur-[100px]" />
      <div className="relative">
        <div className="text-gradient font-heading text-[9rem] font-black leading-none tracking-tighter sm:text-[12rem]">404</div>
        <h1 className="font-heading text-3xl font-extrabold">This page drifted into space</h1>
        <p className="mx-auto mt-3 max-w-md text-fg/60">The page you’re looking for doesn’t exist or has been moved.</p>
        <Link href="/" className="btn-site-primary mt-8"><ArrowLeft className="h-4 w-4" />Back home</Link>
      </div>
    </section>
  );
}
