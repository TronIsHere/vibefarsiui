import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/ui/price";
import { Rating } from "@/components/ui/rating";
import { fa } from "@/lib/utils";

export interface Product {
  id: string;
  name: string;
  price: number;
  /** Original price before discount; the percent is computed. */
  original?: number;
  rating?: number;
  reviews?: number;
  badge?: string;
  image?: React.ReactNode;
  outOfStock?: boolean;
}

/** شبکه‌ی محصول. Four-up product cards with a toman price, discount and an add-to-cart row. */
export function ProductGrid({ title, products, onAdd }: { title?: string; products: Product[]; onAdd?: (p: Product) => void }) {
  return (
    <section className="px-4 py-10 sm:px-6 sm:py-16">
      {title && (
        <div className="mx-auto mb-6 flex max-w-6xl flex-wrap items-center justify-between gap-2 sm:mb-8">
          <h2 className="text-xl font-bold sm:text-2xl">{title}</h2>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground">دیدن همه</a>
        </div>
      )}
      <ul className="mx-auto grid max-w-6xl grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <li key={p.id} className="group flex min-w-0 flex-row overflow-hidden rounded-2xl border border-border bg-card sm:flex-col">
            <div className="relative aspect-square w-[7.25rem] shrink-0 self-stretch bg-secondary sm:aspect-square sm:w-full sm:self-auto">
              {p.image ?? <div aria-hidden className="size-full" style={{ background: "radial-gradient(70% 70% at 50% 40%, oklch(from var(--foreground) l c h / 10%), transparent 70%)" }} />}
              {p.badge && <Badge variant="brand" className="absolute end-1.5 top-1.5 rounded-full bg-card px-1.5 text-[10px] sm:end-3 sm:top-3 sm:px-2 sm:text-xs">{p.badge}</Badge>}
              {p.outOfStock && <div className="absolute inset-0 flex items-center justify-center bg-background/70 text-[11px] font-medium sm:text-sm">ناموجود</div>}
            </div>
            <div className="flex min-w-0 flex-1 flex-col justify-between gap-2 p-3 sm:p-4">
              <div className="min-w-0">
                <h3 className="line-clamp-2 text-sm font-medium leading-6">{p.name}</h3>
                {p.rating !== undefined && (
                  <div className="mt-1 flex min-w-0 flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                    <Rating value={p.rating} readOnly size="sm" />
                    {p.reviews !== undefined && <span>({fa(p.reviews)})</span>}
                  </div>
                )}
              </div>
              <div className="flex items-end justify-between gap-2">
                <Price amount={p.price} original={p.original} size="sm" className="min-w-0" />
                <Button size="icon" variant="outline" className="size-11 shrink-0 sm:size-10" aria-label={`افزودن ${p.name} به سبد`} disabled={p.outOfStock} onClick={() => onAdd?.(p)}><ShoppingCart /></Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
