<template>
  <div>
    <h3>HSV</h3>
    <canvas width="512" height="512" ref="canvas1"></canvas>
  </div>
  <div>
    <h3>RGB</h3>
    <canvas width="512" height="512" ref="canvas2"></canvas>
  </div>
  <div>
    <h3>CIE Lab</h3>
    <canvas width="512" height="512" ref="canvas3"></canvas>
  </div>

  <div>
    <h3>HSV Color Wheel</h3>
    <canvas width="512" height="512" ref="canvas4"></canvas>
  </div>

</template>

<script>
import { Vec3 } from "@/common/lib/math/Vec3.js";
import * as d3 from '@/common/lib/d3-color.v2.js'

export default {
  name: "ColorHint",
  components: {},
  mounted() {
    this.drawHSL();
    this.drawRGB();
    this.drawCIE()
  },
  methods: {
    randomRGB() {
      return new Vec3(0.5 * Math.random(), 0.7, 0.45);
    },

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
  
      const vertex = `
        attribute vec2 position;
        void main() {
          gl_PointSize = 1.0;
          gl_Position = vec4(position, 1.0, 1.0);
        }
      `;

      const fragment = `
        precision mediump float;
        void main()
        {
          gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }    
      `;


    }

  },
};
</script>

<style type='css' scoped>
canvas {
  background: #eee;
}
</style>
