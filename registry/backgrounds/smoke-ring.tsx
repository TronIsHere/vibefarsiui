"use client";

import { GLSL_NOISE, ShaderCanvas } from "@/registry/backgrounds/shader";

const FRAG = GLSL_NOISE + /* glsl */ `
uniform float u_opacity;uniform float u_radius;uniform float u_thickness;
void main(){
  vec2 p=(gl_FragCoord.xy-0.5*u_resolution)/u_resolution.y;
  float r=length(p);
  vec2 dir=p/max(r,1e-4);
  float t=u_time*0.12;
  float n=fbm(dir*1.8+vec2(t,-t*0.8));
  float rad=u_radius*(0.88+0.3*(n-0.5));
  float w=u_thickness*(0.6+0.9*n);
  float band=exp(-pow((r-rad)/w,2.0));
  float smoke=fbm(p*4.0+dir*n*2.5+vec2(-t*1.5,t));
  float wisp=fbm(p*9.0-dir*t*3.0);
  float hole=smoothstep(rad*0.55,rad*0.9,r);
  float v=band*hole*smoothstep(0.25,0.85,smoke+0.25*wisp);
  vec3 col=mix(u_color1,u_color0,smoothstep(0.3,0.75,n));
  gl_FragColor=vec4(col,clamp(v*1.6,0.0,1.0)*u_opacity);
}`;

/** حلقه‌ی دود. A ring of slow, curling smoke around the centre, leaving a clear hole for a headline. WebGL via ShaderCanvas. */
export function SmokeRingBackground({
  speed = 1,
  opacity = 0.8,
  radius = 0.33,
  thickness = 0.075,
  className,
}: {
  speed?: number;
  opacity?: number;
  /** Ring radius as a fraction of the box height. */
  radius?: number;
  /** How thick the smoke band is. */
  thickness?: number;
  className?: string;
}) {
  return <ShaderCanvas fragment={FRAG} colors={["--brand", "--foreground"]} uniforms={{ u_opacity: opacity, u_radius: radius, u_thickness: thickness }} speed={speed} className={className} />;
}
