"use client";

import * as React from "react";
import { LayoutGrid, MapPin, Menu, Search, ShoppingCart, User } from "lucide-react";
import { Button } from "@/registry/ui/button";
import { Sheet } from "@/registry/ui/sheet";
import { cn, fa } from "@/lib/utils";

export interface NavbarShopProps {
  logo: React.ReactNode;
  homeHref?: string;
  /** Category links on the second row. */
  categories: { label: string; href: string; highlight?: boolean }[];
  /** Number of items in the cart; the badge hides at zero. */
  cartCount?: number;
  /** Delivery city or address shown at the end of the second row. */
  location?: string;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  onCartClick?: () => void;
  onAccountClick?: () => void;
  sticky?: boolean;
  className?: string;
}

/** نوار فروشگاه. Search in the middle, account and cart on the left, categories on a second row. */
export function NavbarShop({ logo, homeHref = "/", categories, cartCount = 0, location, searchPlaceholder = "جست‌وجوی محصول، برند یا دسته", onSearch, onCartClick, onAccountClick, sticky = true, className }: NavbarShopProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const id = React.useId();

  const search = (
    <form role="search" className="flex h-10 flex-1 items-center gap-2 rounded-field border-line-field border-input bg-field px-3 focus-within:ring-2 focus-within:ring-ring/60" onSubmit={(e) => { e.preventDefault(); if (query.trim()) onSearch?.(query.trim()); }}>
      <Search aria-hidden className="size-4 shrink-0 text-muted-foreground" />
      <label htmlFor={id} className="sr-only">جست‌وجو</label>
      <input id={id} type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={searchPlaceholder} className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/70 [&::-webkit-search-cancel-button]:hidden" />
    </form>
  );

  return (
    <>
      <header className={cn("z-40 border-b border-border bg-background", sticky && "sticky top-0", className)}>
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
          <Button variant="ghost" size="icon" className="md:hidden" aria-label="دسته‌بندی‌ها" onClick={() => setOpen(true)}><Menu /></Button>
          <a href={homeHref} className="flex shrink-0 items-center gap-2 text-base font-bold">{logo}</a>
          <div className="hidden flex-1 md:flex md:max-w-xl md:ps-4">{search}</div>
          <div className="ms-auto flex items-center gap-1">
            <Button variant="outline" size="sm" className="hidden sm:inline-flex" onClick={onAccountClick}><User />ورود | ثبت‌نام</Button>
            <Button variant="ghost" size="icon" className="sm:hidden" aria-label="حساب کاربری" onClick={onAccountClick}><User /></Button>
            <span aria-hidden className="mx-1 hidden h-6 w-px bg-border sm:block" />
            <Button variant="ghost" size="icon" className="relative" aria-label={cartCount ? `سبد خرید، ${fa(cartCount)} کالا` : "سبد خرید"} onClick={onCartClick}>
              <ShoppingCart />
              {cartCount > 0 && <span className="absolute -top-0.5 -end-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[11px] font-bold text-brand-foreground">{fa(cartCount)}</span>}
            </Button>
          </div>
        </div>
        <div className="px-4 pb-3 md:hidden">{search}</div>
        <nav aria-label="دسته‌بندی‌ها" className="hidden border-t border-border md:block">
          <div className="mx-auto flex h-11 max-w-6xl items-center gap-1 px-6 text-sm">
            <span className="flex items-center gap-2 pe-3 font-medium"><LayoutGrid className="size-4" />دسته‌بندی کالاها</span>
            <ul className="flex flex-1 items-center gap-1 overflow-hidden">
              {categories.map((c) => (
                <li key={c.label}><a href={c.href} className={cn("rounded-md px-2.5 py-1.5 transition-colors hover:bg-accent", c.highlight ? "font-medium text-brand" : "text-muted-foreground hover:text-foreground")}>{c.label}</a></li>
              ))}
            </ul>
            {location && <span className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground"><MapPin className="size-3.5" />ارسال به {location}</span>}
          </div>
        </nav>
      </header>
      <Sheet open={open} onOpenChange={setOpen} title="دسته‌بندی کالاها">
        <ul className="flex flex-col p-2">
          {categories.map((c) => (
            <li key={c.label}><a href={c.href} onClick={() => setOpen(false)} className={cn("block rounded-md px-3 py-2.5 text-sm hover:bg-accent", c.highlight && "font-medium text-brand")}>{c.label}</a></li>
          ))}
        </ul>
        {location && <p className="mt-auto flex items-center gap-1.5 border-t border-border p-4 text-xs text-muted-foreground"><MapPin className="size-3.5" />ارسال به {location}</p>}
      </Sheet>
    </>
  );
}
