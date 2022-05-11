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
  #define PI 3.14159265358979323846
  varying vec2 vUv;
  uniform vec2 u_resolution;
  uniform int rows;
  uniform float r;
  float random (in vec2 _st) {
      return fract(sin(dot(_st.xy, vec2(12.9898,78.233)))*43758.5453123);
  }
  vec2 truchetPattern(in vec2 _st, in float _index){
      _index = fract(((_index-0.5)*2.0));
      if (_index > 0.75) {
          _st = vec2(1.0) - _st;
      } else if (_index > 0.5) {
          _st = vec2(1.0-_st.x,_st.y);
      } else if (_index > 0.25) {
          _st = 1.0-vec2(1.0-_st.x,_st.y);
      }
      return _st;
  }
  void main() {
      vec2 st = vUv * float(rows);
      vec2 ipos = floor(st);  // integer
      vec2 fpos = fract(st);  // fraction
      vec2 tile = truchetPattern(fpos, random( ipos ) * r);
      float color = 0.0;
      color = smoothstep(tile.x-0.1,tile.x,tile.y)-
              smoothstep(tile.x,tile.x+0.1,tile.y);
      gl_FragColor = vec4(vec3(color),1.0);
  }
`;

module.exports  = {
  vertex,
  fragment
}