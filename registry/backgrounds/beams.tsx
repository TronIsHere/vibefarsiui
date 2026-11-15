"use client";

import { GLSL_NOISE, ShaderCanvas } from "@/registry/backgrounds/shader";

const FRAG = GLSL_NOISE + /* glsl */ `
uniform float u_opacity;uniform float u_count;
void main(){
  vec2 uv=gl_FragCoord.xy/u_resolution;
  float asp=u_resolution.x/u_resolution.y;
  float x=uv.x*asp;
  float t=u_time*0.3;
  float acc=0.0;
  float tone=0.0;
  for(int i=0;i<8;i++){
    float fi=float(i);
    if(fi>=u_count) break;
    float h=hash(vec2(fi,3.7));
    float cx=(fi+0.5)/u_count*asp+0.18*sin(t*(0.4+h*0.5)+fi*1.7);
    cx+=(uv.y-0.5)*0.35*(h-0.5);
    float w=0.035+0.06*h;
    float d=x-cx;
    float b=exp(-d*d/(w*w));
    float streak=noise(vec2(d*55.0+fi*9.0,uv.y*1.6-t*(0.6+h)));
    float v=b*(0.45+0.55*streak);
    acc+=v;
    tone+=v*h;
  }
  float fall=mix(0.15,1.0,smoothstep(0.0,1.0,uv.y));
  vec3 col=mix(u_color1,u_color0,clamp(tone/max(acc,1e-4)*1.6,0.0,1.0));
  gl_FragColor=vec4(col,clamp(acc*fall,0.0,1.0)*u_opacity);
}`;

/** ستون‌های نور. Soft vertical shafts of light that sway and shimmer, brightest at the top, like stage lights in haze. WebGL via ShaderCanvas. */
export function BeamsBackground({
  speed = 1,
  opacity = 0.6,
  count = 6,
  className,
}: {
  speed?: number;
  opacity?: number;
  /** Number of beams, up to 8. */
  count?: number;
  className?: string;
}) {
  return <ShaderCanvas fragment={FRAG} colors={["--brand", "--foreground"]} uniforms={{ u_opacity: opacity, u_count: Math.min(8, Math.max(1, count)) }} speed={speed} className={className} />;
}
