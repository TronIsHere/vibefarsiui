"use client";

import { GridBackground } from "@/registry/backgrounds/grid";
import { DotsBackground } from "@/registry/backgrounds/dots";
import { GirihBackground } from "@/registry/backgrounds/girih";
import { HatchBackground } from "@/registry/backgrounds/hatch";
import { AuroraBackground } from "@/registry/backgrounds/aurora";
import { SpotlightBackground } from "@/registry/backgrounds/spotlight";
import { GrainBackground } from "@/registry/backgrounds/grain";
import { RetroGridBackground } from "@/registry/backgrounds/retro-grid";
import { MeshBackground } from "@/registry/backgrounds/mesh";
import { FlickerBackground } from "@/registry/backgrounds/flicker";
import { RingsBackground } from "@/registry/backgrounds/rings";
import { GradientMeshBackground } from "@/registry/backgrounds/gradient-mesh";
import { ConicSpinBackground } from "@/registry/backgrounds/conic-spin";
import { LightLeakBackground } from "@/registry/backgrounds/light-leak";
import { StarsBackground } from "@/registry/backgrounds/stars";
import { SonarBackground } from "@/registry/backgrounds/sonar";
import { DotWaveBackground } from "@/registry/backgrounds/dot-wave";
import { AuroraRibbonsBackground } from "@/registry/backgrounds/aurora-ribbons";
import { GradientGrainBackground } from "@/registry/backgrounds/gradient-grain";
import { MovingStripesBackground } from "@/registry/backgrounds/moving-stripes";
import { ShaderCanvas } from "@/registry/backgrounds/shader";
import { SilkBackground } from "@/registry/backgrounds/silk";
import { FogBackground } from "@/registry/backgrounds/fog";
import { NebulaBackground } from "@/registry/backgrounds/nebula";
import { ContourBackground } from "@/registry/backgrounds/contour";
import { VoronoiBackground } from "@/registry/backgrounds/voronoi";
import { WarpGridBackground } from "@/registry/backgrounds/warp-grid";
import { GodraysBackground } from "@/registry/backgrounds/godrays";
import { WaterRippleBackground } from "@/registry/backgrounds/water-ripple";
import { DitherBackground } from "@/registry/backgrounds/dither";
import { HalftoneBackground } from "@/registry/backgrounds/halftone";
import { WavesBackground } from "@/registry/backgrounds/waves";
import { PlasmaBackground } from "@/registry/backgrounds/plasma";
import { TruchetBackground } from "@/registry/backgrounds/truchet";
import { HexGridBackground } from "@/registry/backgrounds/hex-grid";
import { MarbleBackground } from "@/registry/backgrounds/marble";
import { MetaballsBackground } from "@/registry/backgrounds/metaballs";
import { KaleidoscopeBackground } from "@/registry/backgrounds/kaleidoscope";
import { CursorTrailBackground } from "@/registry/backgrounds/cursor-trail";
import { ParticlesBackground } from "@/registry/backgrounds/particles";
import { MoireBackground } from "@/registry/backgrounds/moire";
import { ScanlinesBackground } from "@/registry/backgrounds/scanlines";
import { IsoCubesBackground } from "@/registry/backgrounds/iso-cubes";
import { LiquidGradientBackground } from "@/registry/backgrounds/liquid-gradient";
import { IridescenceBackground } from "@/registry/backgrounds/iridescence";
import { OrbBackground } from "@/registry/backgrounds/orb";
import { HyperspaceBackground } from "@/registry/backgrounds/hyperspace";
import { BeamsBackground } from "@/registry/backgrounds/beams";
import { LiquidChromeBackground } from "@/registry/backgrounds/liquid-chrome";
import { SmokeRingBackground } from "@/registry/backgrounds/smoke-ring";
import { LightningBackground } from "@/registry/backgrounds/lightning";
import { GradientBlindsBackground } from "@/registry/backgrounds/gradient-blinds";
import { SwirlBackground } from "@/registry/backgrounds/swirl";
import { NeuralVeinsBackground } from "@/registry/backgrounds/neural-veins";

/** The shader primitive's own demo: the usage example from its docs page. */
const HELLO_SHADER = /* glsl */ `
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float glow = smoothstep(0.7, 0.0, distance(uv, u_pointer));
  vec3 color = mix(u_color0, u_color1, uv.y);
  gl_FragColor = vec4(color, glow * 0.35);
}`;

/** Hero-style overlay for the hero shaders, so the card shows how copy sits on top. */
function HeroCopy({ title, eyebrow }: { title: string; eyebrow: string }) {
  return (
    <div className="pointer-events-none relative z-10 flex size-full flex-col items-center justify-center text-center [text-shadow:0_0_14px_var(--background),0_0_4px_var(--background)]">
      <span className="text-[10px] text-muted-foreground">{eyebrow}</span>
      <span className="mt-0.5 text-lg font-black drop-shadow-sm">{title}</span>
    </div>
  );
}

/** Each demo is an absolutely-positioned layer; render inside a `relative overflow-hidden` box. */
export const backgroundDemos: Record<string, React.ReactNode> = {
  grid: <GridBackground />,
  dots: <DotsBackground />,
  girih: <GirihBackground />,
  hatch: <HatchBackground />,
  aurora: <AuroraBackground />,
  spotlight: <SpotlightBackground />,
  grain: <GrainBackground />,
  "retro-grid": <RetroGridBackground />,
  mesh: <MeshBackground />,
  flicker: <FlickerBackground />,
  rings: <RingsBackground />,
  "gradient-mesh": <GradientMeshBackground />,
  "conic-spin": <ConicSpinBackground />,
  "light-leak": <LightLeakBackground />,
  stars: <StarsBackground />,
  sonar: <SonarBackground />,
  "dot-wave": <DotWaveBackground />,
  "aurora-ribbons": <AuroraRibbonsBackground />,
  "gradient-grain": <GradientGrainBackground />,
  "moving-stripes": <MovingStripesBackground />,
  shader: <ShaderCanvas fragment={HELLO_SHADER} colors={["--brand", "--foreground"]} pointer />,
  silk: <SilkBackground />,
  fog: <FogBackground />,
  nebula: <NebulaBackground />,
  contour: <ContourBackground />,
  voronoi: <VoronoiBackground />,
  "warp-grid": <WarpGridBackground />,
  godrays: <GodraysBackground />,
  "water-ripple": <WaterRippleBackground />,
  dither: <DitherBackground />,
  halftone: <HalftoneBackground />,
  waves: <WavesBackground />,
  plasma: <PlasmaBackground />,
  truchet: <TruchetBackground />,
  "hex-grid": <HexGridBackground />,
  marble: <MarbleBackground />,
  metaballs: <MetaballsBackground />,
  kaleidoscope: <KaleidoscopeBackground />,
  "cursor-trail": <CursorTrailBackground />,
  particles: <ParticlesBackground />,
  moire: <MoireBackground />,
  scanlines: <ScanlinesBackground />,
  "iso-cubes": <IsoCubesBackground />,
  "liquid-gradient": <LiquidGradientBackground />,
  "iridescence": <><IridescenceBackground /><HeroCopy eyebrow="استودیو طراحی" title="رنگ را حس کنید" /></>,
  "orb": <><OrbBackground /><HeroCopy eyebrow="دستیار هوشمند" title="بپرس، بساز" /></>,
  "hyperspace": <><HyperspaceBackground /><HeroCopy eyebrow="نسخه‌ی جدید" title="سریع‌تر از همیشه" /></>,
  "beams": <><BeamsBackground /><HeroCopy eyebrow="رویداد ۱۴۰۵" title="روی صحنه" /></>,
  "liquid-chrome": <><LiquidChromeBackground /><HeroCopy eyebrow="محصول تازه" title="ساخته از جنس آینده" /></>,
  "smoke-ring": <><SmokeRingBackground /><HeroCopy eyebrow="به‌زودی" title="چیزی در راه است" /></>,
  "lightning": <><LightningBackground /><HeroCopy eyebrow="زیرساخت ابری" title="قدرت خالص" /></>,
  "gradient-blinds": <><GradientBlindsBackground /><HeroCopy eyebrow="آژانس خلاق" title="ایده‌هایی که می‌درخشند" /></>,
  "swirl": <><SwirlBackground pixel={3} /><HeroCopy eyebrow="جشنواره‌ی هنر" title="رنگ‌ها را هم بزنید" /></>,
  "neural-veins": <><NeuralVeinsBackground /><HeroCopy eyebrow="هوش مصنوعی فارسی" title="مدلی که فکر می‌کند" /></>,
};
