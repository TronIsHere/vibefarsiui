"use client";

import { ShaderCanvas } from "@/registry/backgrounds/shader";

const FRAG = /* glsl */ `
uniform float u_opacity;uniform float u_scale;
void main(){
  vec2 p=(2.0*gl_FragCoord.xy-u_resolution)/u_resolution.y*u_scale;
  float t=u_time*0.18;
  vec2 m=(u_pointer-0.5)*1.5;
  for(int i=1;i<8;i++){
    float fi=float(i);
    p.x+=0.35/fi*sin(fi*2.5*p.y+t+m.x);
    p.y+=0.35/fi*cos(fi*2.5*p.x+t*1.1+m.y);
  }
  float v=0.5+0.5*sin(3.0*(p.x+p.y));
  float body=pow(v,1.4);
  float spec=pow(v,24.0);
  float rim=pow(1.0-v,10.0);
  vec3 col=mix(u_color1,u_color0,body);
  col=mix(col,vec3(1.0),spec*0.9);
  col=mix(col,u_color2,rim*0.5);
  gl_FragColor=vec4(col,u_opacity);
}`;

/** کروم مایع. Molten metal that ripples and folds, with sharp specular highlights and a faint brand-coloured rim. The pointer bends the flow. WebGL via ShaderCanvas. */
export function LiquidChromeBackground({
  speed = 1,
  opacity = 0.75,
  scale = 1,
  className,
}: {
  speed?: number;
  opacity?: number;
  scale?: number;
  className?: string;
}) {
  return <ShaderCanvas fragment={FRAG} colors={["--foreground", "--background", "--brand"]} uniforms={{ u_opacity: opacity, u_scale: scale }} speed={speed} pointer className={className} />;
}
