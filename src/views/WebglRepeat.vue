<template>
  <div>
    <canvas width="500" height="500" ref="canvas"></canvas>
  </div>
</template>

<script>

export default {
  name: "WebglRound",
  components: {},
  mounted() {
    this.init();
  },
  methods: {
    init() {

      const canvas = document.querySelector("canvas");
      const renderer = new GlRenderer(canvas);

      const {vertex, fragment} = this.createShader()
      const program = renderer.compileSync(fragment, vertex);
      renderer.useProgram(program);

      renderer.uniforms.rows = 20;
      renderer.uniforms.r = Math.random() * 0.5 + 0.5

      renderer.setMeshData([
        {
          positions: [
            [-1, -1],
            [-1, 1],
            [1, 1],
            [1, -1],
          ],
          attributes: {
            uv: [
              [0, 0],
              [0, 1],
              [1, 1],
              [1, 0],
            ],
          },
          cells: [
            [0, 1, 2],
            [2, 0, 3],
          ],
        },
      ]);

      renderer.render();

    },

    createShader(){

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

      return {
        vertex,
        fragment
      }

    },

    update(renderer){
      var diff = 0.02;
      requestAnimationFrame(function update() {
        //明度跟随时间变化
        const u_time = renderer.uniforms.u_time;
        if (u_time > 1 || u_time < 0) {
          diff = -diff;
        }
        renderer.uniforms.u_time += diff;

        //饱和度跟随鼠标变化
        requestAnimationFrame(update);
      })
    }
  },
};
</script>

<style>
</style>
