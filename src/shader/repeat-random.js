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

float random (vec2 st) {
    return fract(sin(dot(st.xy,vec2(12.9898,78.233)))* 43758.5453123);
}

void main() {
    //10倍后取整，放大噪点的尺寸
    vec2 st = vUv * vec2(10.0, 20.0);
    gl_FragColor.rgb = vec3(random(floor(st)));
    gl_FragColor.a = 1.0;
}
`;

module.exports  = {
  vertex,
  fragment
}