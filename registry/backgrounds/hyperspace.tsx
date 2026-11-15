"use client";

import { GLSL_NOISE, ShaderCanvas } from "@/registry/backgrounds/shader";

const FRAG = GLSL_NOISE + /* glsl */ `
uniform float u_opacity;uniform float u_streak;
void main(){
  vec2 c=(u_pointer-0.5)*0.12;
  vec2 p=(gl_FragCoord.xy-0.5*u_resolution)/u_resolution.y-c;
  float r=length(p);
  float a=atan(p.y,p.x)/(2.0*PI)+0.5;
  float px=1.4/u_resolution.y*u_dpr;
  float acc=0.0;
  vec3 col=vec3(0.0);
  for(int L=0;L<3;L++){
    float fl=float(L);
    float sectors=70.0+fl*45.0;
    float s=floor(a*sectors);
    float h=hash(vec2(s,fl*7.13+1.0));
    float z=fract(h*13.7+u_time*(0.12+h*0.22));
    float head=z*z*1.3;
    float len=(0.03+z*0.35)*u_streak;
    float arc=abs(fract(a*sectors)-0.5)/sectors*2.0*PI*r;
    float core=smoothstep(px*(1.0+z*1.5),0.0,arc);
    float along=smoothstep(head-len,head,r)*step(r,head);
    float v=core*along*z*(0.4+h);
    acc+=v;
    col+=v*mix(u_color1,u_color0,step(0.7,h));
  }
  col/=max(acc,1e-4);
  float glow=exp(-r*7.0)*0.35;
  col=mix(col,u_color0,glow/(acc+glow+1e-4));
  gl_FragColor=vec4(col,clamp(acc+glow,0.0,1.0)*u_opacity);
}`;

/** ابرفضا. Stars stretch into streaks and race out of a vanishing point, as if jumping to light speed; the pointer shifts the vanishing point a little. WebGL via ShaderCanvas. */
export function HyperspaceBackground({
  speed = 1,
  opacity = 0.9,
  streak = 1,
  className,
}: {
  speed?: number;
  opacity?: number;
  /** Streak length multiplier. */
  streak?: number;
  className?: string;
}) {
  return <ShaderCanvas fragment={FRAG} colors={["--brand", "--foreground"]} uniforms={{ u_opacity: opacity, u_streak: streak }} speed={speed} pointer className={className} />;
}
