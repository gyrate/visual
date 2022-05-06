<template>
 <div class="color-hint">
   <section>
     <h3>HSV Color Wheel: 明度、饱和度随着半径变化</h3>
     <canvas width="512" height="512" ref="canvas4"></canvas>
   </section>

   <section>
     <h3>HSV: 色相 饱和度 亮度</h3>
     <canvas width="512" height="512" ref="canvas1"></canvas>
   </section>

   <section>
     <h3>RGB: 红绿蓝</h3>
     <canvas width="512" height="512" ref="canvas2"></canvas>
   </section>

   <section>
     <h3>CIE Lab: 较符合人体视觉的颜色算法</h3>
     <canvas width="512" height="512" ref="canvas3"></canvas>
   </section>
 </div>

</template>

<script>
import { Vec3 } from "@/common/lib/math/Vec3.js";
import * as d3 from '@/common/lib/d3-color.v2.js'
import {earcut} from '@/common/lib/earcut.js';

export default {
  name: "ColorHint",
  components: {},
  mounted() {
    this.drawHSL();
    this.drawRGB();
    this.drawCIE()
    this.drawHsvWheel()
  },
  methods: {
    randomRGB() {
      return new Vec3(0.5 * Math.random(), 0.7, 0.45);
    },

    //按HSL变化生成颜色
    drawHSL() {
      const canvas = this.$refs["canvas1"];
      const ctx = canvas.getContext("2d");
      ctx.translate(256, 256);
      ctx.scale(1, -1);

      const [h, s, l] = this.randomRGB();
      for (let i = 0; i < 3; i++) {
        const p = (i * 0.25 + h) % 1;
        for (let j = 0; j < 5; j++) {
          const d = j - 2;
          ctx.fillStyle = `hsl(
                ${Math.floor(p * 360)}, 
                ${Math.floor((0.15 * d + s) * 100)}%, 
                ${Math.floor((0.12 * d + l) * 100)}%
            )`;
          ctx.beginPath();
          ctx.arc((j - 2) * 60, (i - 1) * 60, 20, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    },

    //按RGB变化生成颜色
    drawRGB() {
      const canvas = this.$refs["canvas2"];
      const ctx = canvas.getContext("2d");
      ctx.translate(256, 256);
      ctx.scale(1, -1);

      for (let i = 0; i < 3; i++) {
        const colorVector = this.randomRGB();
        for (let j = 0; j < 5; j++) {
          const c = colorVector.clone().scale(0.5 + 0.25 * j);
          ctx.fillStyle = `rgb(
              ${Math.floor(c[0] * 256)},
             ${Math.floor(c[1] * 256)}, 
              ${Math.floor(c[2] * 256)}
           )`;
          ctx.beginPath();
          ctx.arc((j - 2) * 60, (i - 1) * 60, 20, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    },

    //试用CIE算法生成颜色
    drawCIE() {
      const canvas = this.$refs["canvas3"];
      const ctx = canvas.getContext("2d");
      ctx.translate(256, 256);
      ctx.scale(1, -1);

      for (let i = 0; i < 20; i++) {
        const c = d3.lab(30, i * 15 - 150, i * 15 - 150).rgb();
        ctx.fillStyle = `rgb(${c.r},${c.g},${c.b})`;
        ctx.beginPath();
        ctx.arc((i - 10) * 20, 60, 10, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = 0; i < 20; i++) {
        const c = d3.lab(i * 8, 80, 80).rgb();
        ctx.fillStyle = `rgb(${c.r},${c.g},${c.b})`;
        ctx.beginPath();
        ctx.arc((i - 10) * 20, -60, 10, 0, Math.PI * 2);
        ctx.fill();
      }
    },

    //绘制色盘
    drawHsvWheel(){
      const canvas = this.$refs["canvas4"];
      const gl = canvas.getContext('webgl');

      //着色器
      const program = this.createProgram({gl})
      gl.useProgram(program)

      //位置数据
      const c1 = this.createCircle({radius: 1, seg: 100, x: 0, y: 0})
      const points = c1.flat()
      const cell = earcut(points)

      //webgl 一顿操作
      const position = new Float32Array(points)
      const cells = new Uint16Array(cell)

      const pointBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, position, gl.STATIC_DRAW)

      //如何传参数uniforms.u_radius进去？
      const vPosition = gl.getAttribLocation(program, 'position')
      gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0,0)
      gl.enableVertexAttribArray(vPosition)

      const cellsBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cellsBuffer)
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, cells, gl.STATIC_DRAW)

      //设置获取变量引用
      const dd = gl.getUniformLocation(program, 'dd_resolution')
      //设置变量
      gl.uniform2f(dd, canvas.width, canvas.height )

      //绘制几何切片
      gl.drawElements(gl.TRIANGLES, cell.length , gl.UNSIGNED_SHORT, 0)
    },

    createShader({gl, type}) {

      //该方法有误
      const vertex1 = `
        #define PI 3.1415926535897932384626433832795
        attribute vec2 position;
        varying vec4 vColor;

        //外部定义半径
        uniform float u_radius;

        vec3 hsv2rgb(vec3 c){
          vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0), 6.0)-3.0)-1.0, 0.0, 1.0);
          rgb = rgb * rgb * (3.0 - 2.0 * rgb);
          return c.z * mix(vec3(1.0), rgb, c.y);
        }

        void main(){

          float x = position.x;
          float y = position.y;

          float hue = atan(y, x) / (PI * 2.0);

          float len = sqrt(x * x + y * y) ;

          vec3 hsv = vec3(hue, 1.0, 1.0);
          vec3 rgb = hsv2rgb(hsv);
          vColor = vec4(rgb, 1.0);
          gl_Position = vec4(position, 1.0, 1.0);
        }
      `;
      const fragment1 = `
        precision mediump float;
        varying vec4 vColor;
        void main(){
          gl_FragColor = vColor;
        }
      `;


      const vertex2 = `
        attribute vec2 position;
        void main() {
          gl_PointSize = 1.0;
          gl_Position = vec4(position, 1.0, 1.0);
        }
      `;

      const fragment2 = `
        precision mediump float;
        #define TWO_PI 6.28318530718
        uniform vec2 dd_resolution;

        vec3 hsv2rgb(vec3 c){
            vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0), 6.0)-3.0)-1.0, 0.0, 1.0);
            rgb = rgb * rgb * (3.0 - 2.0 * rgb);
            return c.z * mix(vec3(1.0), rgb, c.y);
        }

        void main() {
            //gl_FragCoord.xy 取值范围为[0-画布宽高]，st的值范围为[0,0 - 1,1]
            vec2 st = gl_FragCoord.xy / dd_resolution.xy;
            vec2 toCenter = vec2(0.5) - st;
            float radius = length(toCenter) ;
            float angle = atan(toCenter.y, toCenter.x);
            vec3 color = hsv2rgb(vec3((angle / TWO_PI) , radius * 2.0, 1));
            gl_FragColor = vec4(color, 1.0);
        }
      `;

      const shader = gl.createShader(type)

      // const source = type == gl.VERTEX_SHADER ? vertex1 : fragment1
      const source = type == gl.VERTEX_SHADER ? vertex2 : fragment2

      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
      if (success) {
        return shader
      }
      console.log(gl.getShaderInfoLog(shader))
      gl.deleteShader(shader)
    },

    createProgram({gl}){

      const vertexShader = this.createShader({gl, type: gl.VERTEX_SHADER})
      const fragmentShader = this.createShader({gl, type: gl.FRAGMENT_SHADER})

      const program = gl.createProgram()
      gl.attachShader(program, vertexShader)
      gl.attachShader(program, fragmentShader)
      gl.linkProgram(program)


      const success = gl.getProgramParameter(program, gl.LINK_STATUS)
      if(success){
        console.log('link 成功')
        return program
      }
      console.log(gl.getProgramInfoLog(program))
      return program
    },

    createCircle({radius, seg, x, y}) {
      const res = []
      for (let i = 0; i < seg; i++) {
        const angle = i * 2 * Math.PI / seg
        res.push([
          x + radius * Math.cos(angle),
          y + radius * Math.sin(angle)
        ])
      }
      return res
    },


  },
};
</script>

<style lang="scss" scoped>
.color-hint{
  padding: 2em;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  h3{
    padding: 0.5em;
  }
  section{
    flex: 1;
  }
  canvas {
    background: #eee;
  }
}


</style>
