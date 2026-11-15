"use client";

import { ShaderCanvas } from "@/registry/backgrounds/shader";

const FRAG = /* glsl */ `
uniform float u_opacity;uniform float u_twist;uniform float u_pixel;
void main(){
  vec2 fc=gl_FragCoord.xy;
  if(u_pixel>0.0){float s=u_pixel*u_dpr;fc=(floor(fc/s)+0.5)*s;}
  vec2 p=(fc-0.5*u_resolution)/u_resolution.y;
  float t=u_time*0.18;
  float r=length(p);
  float a=atan(p.y,p.x)+u_twist/(r+0.35)+t;
  vec2 q=vec2(cos(a),sin(a))*r*3.2;
  for(int i=0;i<5;i++){
    float fi=float(i);
    q+=0.55*vec2(sin(q.y*1.3+t*1.4+fi),cos(q.x*1.1-t+fi*0.7));
  }
  float v=0.5+0.5*sin(q.x+q.y);
  vec3 col=mix(u_color0,u_color1,smoothstep(0.35,0.5,v));
  col=mix(col,u_color2,smoothstep(0.68,0.82,v));
  gl_FragColor=vec4(col,u_opacity);
}`;

/** گرداب. Thick paint bands that spiral around the centre and keep folding into each other, with an optional chunky pixel look. WebGL via ShaderCanvas. */
export function SwirlBackground({
  speed = 1,
  opacity = 0.75,
  twist = 1.2,
  pixel = 0,
  className,
}: {
  speed?: number;
  opacity?: number;
  /** How hard the bands wind around the centre. */
  twist?: number;
  /** Pixel block size in CSS px; 0 keeps it smooth. */
  pixel?: number;
  className?: string;
}) {
  return <ShaderCanvas fragment={FRAG} colors={["--brand", "--background", "--foreground"]} uniforms={{ u_opacity: opacity, u_twist: twist, u_pixel: pixel }} speed={speed} className={className} />;
}
