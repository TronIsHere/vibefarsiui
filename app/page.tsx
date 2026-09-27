import { Frame, HatchBand } from "@/components/landing/frame";
import { TopBar } from "@/components/landing/top-bar";
import { Hero } from "@/components/landing/hero";
import { Showcase } from "@/components/landing/showcase";
import { Closing } from "@/components/landing/closing";
import { Sponsors } from "@/components/landing/sponsors";
import { JsonLd } from "@/components/shared/json-ld";
import { faqJsonLd } from "@/lib/faq";
import { MonoFooter } from "@/components/landing/footer";
import { Faq } from "@/components/landing/faq";

export default function Home() {
  return (
    <div className="flex min-h-full min-w-0 flex-1 flex-col">
      <TopBar />
      <main className="min-w-0 flex-1 overflow-x-clip">
        <JsonLd data={faqJsonLd()} />
        <Frame>
          <Hero />
          <Showcase />
          <HatchBand />
          <Closing />
          <HatchBand />
          <Sponsors />
          <HatchBand />
          <Faq />
          <HatchBand />
          <MonoFooter />
        </Frame>
      </main>
    </div>
  );
}
