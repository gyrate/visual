const vertex = `
  attribute vec2 a_vertexPosition;
  attribute vec2 uv; //范围0到1的纹理坐标
  varying vec2 vUv;
  void main() {
    gl_PointSize = 1.0;
    vUv = uv;
    gl_Position = vec4(a_vertexPosition, 1.0, 1.0);
  }
`;

const fragment = `
#ifdef GL_ES
precision highp float;
#endif

varying vec2 vUv;

uniform float uTime;

float random (vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233)))* 43758.5453123);
}

void main() {
    vec2 st = vUv * vec2(50, 50.0);

    //st.x -= (1.0 + 10.0 * random(vec2(floor(st.y)))) * uTime; //x轴平移

    vec2 ipos = floor(st);  // integer
    vec2 fpos = fract(st);  // fraction

    vec3 color = vec3(step(random(ipos), 0.9)); //纵向边
    color *= step(0.1,fpos.y); //横向边

    gl_FragColor.rgb = color;
    gl_FragColor.a = 1.0;
}
`;

module.exports  = {
  vertex,
  fragment
}