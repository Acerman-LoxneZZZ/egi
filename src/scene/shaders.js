// Simplex noise by Ian McEwan / Ashima Arts, MIT; Stefan Gustavson's GLSL implementation.
export const simplex = `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
 const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
 vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
 vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
 vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
 i=mod289(i);vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
 float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;
 vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);
 vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);
 vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
 vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));
 vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
 vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
 vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
 p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
 vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
 m=m*m;return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

export const dustVertex = `
uniform float uTime,uSize,uDpr;attribute float aSeed;varying float vLight;
${simplex}
void main(){
 vec3 p=position;float t=uTime*.055;
 vec3 flow=vec3(p.xy*.17,aSeed*5.0+t);
 p.x=mod(p.x+uTime*(.04+aSeed*.07)+18.0,36.0)-18.0;
 p.y+=snoise(flow)*.8;p.x+=snoise(flow.yzx+7.0)*.65;
 vec4 mv=modelViewMatrix*vec4(p,1.0);
 gl_Position=projectionMatrix*mv;
 gl_PointSize=clamp(uSize*uDpr*12.0/max(2.0,-mv.z),1.0,14.0);
 vLight=.55+.45*pow(max(0.0,sin(uTime*.28+aSeed*32.0)),6.0);
}`;
export const dustFragment = `
uniform float uOpacity;varying float vLight;
void main(){float r=length(gl_PointCoord-.5)*2.0;if(r>1.0)discard;
 float a=exp(-r*r*5.0)*(1.0-smoothstep(.65,1.0,r))*uOpacity*vLight;
 gl_FragColor=vec4(vec3(.76,.52,.23),a);
 #include <colorspace_fragment>
}`;
export const cinemaVertex = `varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.0,1.0);}`;
export const cinemaFragment = `
#include <packing>
uniform sampler2D tScene,tDepth;
uniform vec2 uResolution;uniform float uBlur,uFlare,uVignette;
varying vec2 vUv;
void main(){
 float depth=texture2D(tDepth,vUv).x;
 float distance=-perspectiveDepthToViewZ(depth,.15,100.0);
 float coc=uBlur*smoothstep(4.0,16.0,distance);
 vec2 texel=1.0/uResolution;
 vec4 color=texture2D(tScene,vUv)*.2;
 for(int i=0;i<8;i++){
  float a=float(i)*.785398;vec2 offset=vec2(cos(a),sin(a))*texel*coc;
  color+=texture2D(tScene,vUv+offset)*.1;
 }
 vec2 sun=vec2(.94,.54);vec2 ray=sun-vUv;
 if(uFlare>.001){
  float light=0.0;
  for(int i=0;i<10;i++){vec3 c=texture2D(tScene,vUv+ray*float(i)*.085).rgb;light+=max(0.0,dot(c,vec3(.21,.72,.07))-.24)*.1;}
  float halo=exp(-length(ray)*3.5);float rays=pow(max(0.0,cos(atan(ray.y,ray.x)*16.0+length(ray)*6.0)),10.0);
  color.rgb+=vec3(1.0,.61,.26)*uFlare*(halo+light*(1.0+rays)*1.9);
 }
 float vignette=1.0-uVignette*smoothstep(.2,.72,length(vUv-.5));
 color.rgb*=vignette;
 gl_FragColor=color;
 #include <colorspace_fragment>
}`;
