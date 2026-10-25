import { cn } from '@/lib/utils';

// The admin panel's logo: the uploaded image, or the first letter of the panel name on the brand gradient.
export default function AdminLogo({ brand, className }) {
  if (brand.logo) return <img src={brand.logo} alt="" className={cn('shrink-0 rounded-xl object-contain', className)} />;
  return (
    <span className={cn('grid shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-400 via-brand-500 to-fuchsia-500 font-black text-white shadow-brand-glow', className)}>
      {(brand.name || '?')[0].toUpperCase()}
    </span>
  );
}
