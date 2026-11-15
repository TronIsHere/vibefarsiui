"use client";

import { GLSL_NOISE, ShaderCanvas } from "@/registry/backgrounds/shader";

const FRAG = GLSL_NOISE + /* glsl */ `
uniform float u_opacity;uniform float u_x;uniform float u_rate;
float path(float y,float seed){
  return (fbm(vec2(y*2.2,seed))-0.5)*0.55+(noise(vec2(y*18.0,seed*1.7))-0.5)*0.05;
}
void main(){
  vec2 uv=gl_FragCoord.xy/u_resolution;
  float asp=u_resolution.x/u_resolution.y;
  vec2 p=vec2((uv.x-u_x)*asp,uv.y);
  float t=u_time*u_rate;
  float seed=floor(t*6.0);
  float flash=0.55+0.45*noise(vec2(t*24.0,3.0));
  float m0=path(p.y,seed);
  float d=abs(p.x-m0);
  // A fork leaves the main bolt at 60% height and drifts sideways as it falls.
  float side=hash(vec2(seed,9.0))>0.5?1.0:-1.0;
  float drop=max(0.0,0.6-p.y);
  float fx=m0+side*drop*0.6+(noise(vec2(p.y*14.0,seed+5.0))-0.5)*0.06*drop*4.0;
  float reach=1.0-smoothstep(0.0,0.35,drop);
  float fork=abs(p.x-fx)+(1.0-reach)*1.0+step(0.6,p.y)*1.0;
  d=min(d,fork+0.003);
  float px=1.0/u_resolution.y*u_dpr;
  float core=smoothstep(px*2.5,0.0,d);
  float glow=0.012/(d+0.012);
  float haze=exp(-abs(p.x)*3.5)*0.12;
  float taper=smoothstep(0.0,0.25,uv.y);
  float v=(core+glow*0.55)*taper*flash+haze*flash;
  vec3 col=mix(u_color0,vec3(1.0),core);
  gl_FragColor=vec4(col,clamp(v,0.0,1.0)*u_opacity);
}`;

/** آذرخش. An electric bolt that crackles down the section with a fork, a wide glow and a flickering haze; its shape re-rolls several times a second. WebGL via ShaderCanvas. */
export function LightningBackground({
  speed = 1,
  opacity = 0.85,
  x = 0.5,
  className,
}: {
  speed?: number;
  opacity?: number;
  /** Horizontal position of the bolt, 0–1 from the left. */
  x?: number;
  className?: string;
}) {
  return <ShaderCanvas fragment={FRAG} colors={["--brand"]} uniforms={{ u_opacity: opacity, u_x: x, u_rate: 1 }} speed={speed} className={className} />;
}
