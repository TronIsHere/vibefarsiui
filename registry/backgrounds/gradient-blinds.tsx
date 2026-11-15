"use client";

import { ShaderCanvas } from "@/registry/backgrounds/shader";

const FRAG = /* glsl */ `
uniform float u_opacity;uniform float u_blinds;
void main(){
  vec2 uv=gl_FragCoord.xy/u_resolution;
  float asp=u_resolution.x/u_resolution.y;
  float t=u_time*0.25;
  float x=uv.x*u_blinds;
  float fx=fract(x);
  float g=uv.x*0.55+uv.y*0.45+0.18*sin(t+uv.y*3.0+floor(x)*0.35)+fx*0.06;
  vec3 col=mix(u_color0,u_color1,smoothstep(0.1,0.95,g));
  col=mix(col,u_color2,smoothstep(0.55,1.1,1.0-uv.y)*0.55);
  float slat=0.62+0.38*sin(fx*PI);
  float edge=smoothstep(0.0,0.06,fx)*smoothstep(1.0,0.94,fx);
  vec2 d=(uv-u_pointer)*vec2(asp,1.0);
  float spot=exp(-dot(d,d)*5.0);
  col*=slat*(0.85+0.15*edge);
  col=mix(col,vec3(1.0),spot*0.18);
  gl_FragColor=vec4(col,(0.6+0.4*spot)*u_opacity);
}`;

/** کرکره‌ی گرادیانی. A drifting theme gradient seen through vertical blinds, each slat shaded like a fold, with a soft spotlight under the pointer. WebGL via ShaderCanvas. */
export function GradientBlindsBackground({
  speed = 1,
  opacity = 0.8,
  blinds = 14,
  className,
}: {
  speed?: number;
  opacity?: number;
  /** Number of slats across the width. */
  blinds?: number;
  className?: string;
}) {
  return <ShaderCanvas fragment={FRAG} colors={["--brand", "--foreground", "--background"]} uniforms={{ u_opacity: opacity, u_blinds: blinds }} speed={speed} pointer className={className} />;
}
