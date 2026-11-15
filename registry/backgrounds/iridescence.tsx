"use client";

import { ShaderCanvas } from "@/registry/backgrounds/shader";

const FRAG = /* glsl */ `
uniform float u_opacity;uniform float u_tint;uniform float u_scale;
void main(){
  vec2 p=(2.0*gl_FragCoord.xy-u_resolution)/u_resolution.y*u_scale;
  float t=u_time*0.22;
  p+=(u_pointer-0.5)*0.6;
  for(int i=1;i<6;i++){
    float fi=float(i);
    p+=vec2(0.6/fi*sin(fi*p.y+t+0.3*fi),0.6/fi*cos(fi*p.x+t*0.8+0.5*fi));
  }
  float v=0.5+0.5*sin(p.x+p.y);
  vec3 iri=0.5+0.5*cos(6.2831*(v+vec3(0.0,0.33,0.67))+t);
  vec3 col=mix(iri,u_color0,u_tint);
  float sheen=pow(0.5+0.5*sin(p.x*1.5-p.y),8.0);
  col=mix(col,vec3(1.0),sheen*0.35);
  gl_FragColor=vec4(col,u_opacity);
}`;

/** صدف. Oil-slick colours that flow and fold like the inside of a shell; the pointer nudges the field. WebGL via ShaderCanvas. */
export function IridescenceBackground({
  speed = 1,
  opacity = 0.7,
  tint = 0.25,
  scale = 1.3,
  className,
}: {
  speed?: number;
  opacity?: number;
  /** 0–1, how much the brand colour tints the rainbow. */
  tint?: number;
  scale?: number;
  className?: string;
}) {
  return <ShaderCanvas fragment={FRAG} colors={["--brand"]} uniforms={{ u_opacity: opacity, u_tint: tint, u_scale: scale }} speed={speed} pointer className={className} />;
}
