"use client";

import { GLSL_NOISE, ShaderCanvas } from "@/registry/backgrounds/shader";

const FRAG = GLSL_NOISE + /* glsl */ `
uniform float u_opacity;uniform float u_radius;
void main(){
  vec2 asp=vec2(u_resolution.x/u_resolution.y,1.0);
  vec2 p=(gl_FragCoord.xy/u_resolution-0.5)*asp;
  float r=length(p);
  vec2 dir=p/max(r,1e-4);
  float t=u_time*0.35;
  vec2 ptr=(u_pointer-0.5)*asp;
  float hover=smoothstep(0.7,0.0,length(ptr));
  float n=fbm(dir*1.6+vec2(t,-t*0.7)+fbm(dir*3.0-t)*0.8);
  float rad=u_radius*(1.0+(n-0.5)*(0.18+0.25*hover));
  float w=0.012+0.03*n;
  float rim=exp(-pow((r-rad)/w,2.0));
  float halo=exp(-abs(r-rad)*9.0)*0.55;
  float inner=smoothstep(rad,0.0,r)*0.12*(0.6+0.4*sin(t*2.0));
  float a=atan(p.y,p.x);
  vec3 col=mix(u_color0,u_color1,0.5+0.5*sin(a*2.0+t*1.5));
  col=mix(col,vec3(1.0),rim*0.35);
  gl_FragColor=vec4(col,clamp(rim+halo+inner,0.0,1.0)*u_opacity);
}`;

/** گوی نورانی. A glowing hollow sphere with a living, noisy rim; it stirs more when the pointer comes near. Built to sit behind a centred headline. WebGL via ShaderCanvas. */
export function OrbBackground({
  speed = 1,
  opacity = 0.85,
  radius = 0.32,
  className,
}: {
  speed?: number;
  opacity?: number;
  /** Orb radius as a fraction of the box height. */
  radius?: number;
  className?: string;
}) {
  return <ShaderCanvas fragment={FRAG} colors={["--brand", "--foreground"]} uniforms={{ u_opacity: opacity, u_radius: radius }} speed={speed} pointer className={className} />;
}
