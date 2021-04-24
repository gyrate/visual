<template>
  <div>
    <canvas width="300" height="300"></canvas>
  </div>
</template>

<script>

export default {
  name: "WebglRound",
  components: {},
  mounted() {
    this.init()
  },
  methods: {

    init(){
      
      const vertex = `
        //特定的变量
        attribute vec2 a_vertexPosition;
        attribute vec2 uv;

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

        vec3 hsv2rgb(vec3 c){ 
          vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0), 6.0)-3.0)-1.0, 0.0, 1.0); 
          rgb = rgb * rgb * (3.0 - 2.0 * rgb); 
          return c.z * mix(vec3(1.0), rgb, c.y);
        }

        void main() {
          float d = distance(vUv, vec2(0.5));
          //直接边缘
          //gl_FragColor.rgb = step(d, 0.2) * vec3(1.0);
          //光滑的边缘
          //gl_FragColor.rgb = smoothstep(d, d+0.01, 0.3)  * vec3(1.0);
          //内渐变
          //gl_FragColor.rgb = smoothstep(d,0.31, 0.3)  * vec3(1.0);
          //外渐变
          //gl_FragColor.rgb = smoothstep(0.3,d, 0.31)  * vec3(1.0);
          //环状
          //gl_FragColor.rgb = (smoothstep(d, d+0.01, 0.3) -  smoothstep(d, d+0.01, 0.28))  * vec3(1.0);
          
          if(d>0.31){
            gl_FragColor.rgb = vec3(1.0);
          }else if(0.3<=d && d<=0.31){
            gl_FragColor.rgb = vec3(1);
          }else{          
            //float a = atan(vUv- vec2(0.5));
            //float diff = 1.0 - d/0.3;
            //            
            //gl_FragColor.rgb = vec3(1,0,1);

            //角度
            vec2 r = vUv  - vec2(0.5);   
            float a = atan(r.y, r.x);
            gl_FragColor.rgb = hsv2rgb(vec3(a/6.28, d/0.3 + 0.3,  1.8-d/0.3));     

          }        
          gl_FragColor.a = 1.0;
        }   
      `;

      const canvas = document.querySelector('canvas');
      const renderer = new GlRenderer(canvas);
      const program = renderer.compileSync(fragment, vertex);
      renderer.useProgram(program);

      renderer.setMeshData([{
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
        cells: [[0, 1, 2], [2, 0, 3]],
      }]);

      renderer.render();

      
    },


  },
};
</script>

<style>
</style>
