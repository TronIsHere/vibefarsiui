import { Check } from "lucide-react";
import { Button } from "@/registry/ui/button";
import { Price } from "@/registry/ui/price";

export interface PricingSingleProps {
  title: string;
  description?: string;
  amount: number;
  /** Price before discount; the percent is computed. */
  original?: number;
  /** e.g. «تومان، یک‌بار پرداخت». */
  unit?: string;
  features: string[];
  cta?: string;
  /** Reassurance under the button, e.g. «۷ روز ضمانت بازگشت وجه». */
  note?: string;
}

/** قیمت تک‌پلن. For a course, an ebook or a one-off product: features on the right, price box on the left. */
export function PricingSingle({ title, description, amount, original, unit = "تومان", features, cta = "خرید", note }: PricingSingleProps) {
  return (
    <section className="px-6 py-16">
      <div className="mx-auto grid max-w-4xl overflow-hidden rounded-3xl border border-border bg-card md:grid-cols-[1fr_20rem]">
        <div className="p-8 md:p-10">
          <h2 className="text-2xl font-bold leading-10">{title}</h2>
          {description && <p className="mt-3 text-sm leading-7 text-muted-foreground">{description}</p>}
          <div className="mt-8 flex items-center gap-4">
            <span className="text-sm font-semibold text-brand">شامل این‌ها میشه</span>
            <span aria-hidden className="h-px flex-1 bg-border" />
          </div>
          <ul className="mt-6 grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
            {features.map((f) => <li key={f} className="flex items-start gap-2 leading-6"><Check className="mt-1 size-4 shrink-0 text-brand" />{f}</li>)}
          </ul>
        </div>
        <div className="flex flex-col items-center justify-center border-t border-border bg-secondary/40 p-8 text-center md:border-s md:border-t-0">
          <Price amount={amount} original={original} unit={unit} size="lg" className="items-center" />
          <Button size="lg" className="mt-6 w-full">{cta}</Button>
          {note && <p className="mt-4 text-xs leading-6 text-muted-foreground">{note}</p>}
        </div>
      </div>
    </section>
  );
}
