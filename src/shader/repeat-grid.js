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
  precision mediump float;
  #endif
  varying vec2 vUv;
  uniform float  rows;
  
  void main() {
      vec2 st = fract(vUv * rows); 
      float d1 = step(st.x, 0.9); 
      float d2 = step(0.1, st.y);
      gl_FragColor.rgb = mix(vec3(0.8), vec3(1.0), d1 * d2); 
      gl_FragColor.a = 1.0;
  }
`;

module.exports  = {
  vertex,
  fragment
}