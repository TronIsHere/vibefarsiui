"use client";

import { ShaderCanvas } from "@/registry/backgrounds/shader";

const FRAG = /* glsl */ `
uniform float u_opacity;uniform float u_scale;
mat2 rot(float a){float c=cos(a);float s=sin(a);return mat2(c,-s,s,c);}
float veins(vec2 uv,float t){
  vec2 acc=vec2(0.0);
  vec2 res=vec2(0.0);
  float sc=u_scale;
  for(int j=0;j<14;j++){
    uv=rot(1.0)*uv;
    acc=rot(1.0)*acc;
    vec2 layer=uv*sc+float(j)+acc-t;
    acc+=sin(layer);
    res+=(0.5+0.5*cos(layer))/sc;
    sc*=1.2;
  }
  return res.x+res.y;
}
void main(){
  vec2 uv=(gl_FragCoord.xy-0.5*u_resolution)/u_resolution.y;
  vec2 ptr=(u_pointer-0.5)*vec2(u_resolution.x/u_resolution.y,1.0);
  float near=exp(-dot(uv-ptr,uv-ptr)*8.0);
  float t=u_time*0.08;
  float n=veins(uv*(1.0-0.15*near),t);
  n=1.2*pow(n,3.0);
  n+=pow(n,10.0);
  n=max(0.0,n-0.5);
  float fade=1.0-smoothstep(0.35,0.95,length(uv*vec2(0.75,1.0)));
  vec3 col=mix(u_color0,vec3(1.0),clamp(n-0.6,0.0,1.0)*0.5);
  gl_FragColor=vec4(col,clamp(n*fade,0.0,1.0)*u_opacity);
}`;

/** رگه‌های عصبی. A glowing web of thread-like veins that slowly reroutes itself, like neurons firing; the pointer gently lenses the web. Good behind AI products. WebGL via ShaderCanvas. */
export function NeuralVeinsBackground({
  speed = 1,
  opacity = 0.85,
  scale = 8,
  className,
}: {
  speed?: number;
  opacity?: number;
  /** Starting frequency of the veins; higher is finer. */
  scale?: number;
  className?: string;
}) {
  return <ShaderCanvas fragment={FRAG} colors={["--brand"]} uniforms={{ u_opacity: opacity, u_scale: scale }} speed={speed} pointer className={className} />;
}
