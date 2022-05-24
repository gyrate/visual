<template>
  <div>
    <h3>流光效果</h3>
    <canvas width="500" height="300" ref="canvas"></canvas>

    <div>
      <label>半径</label>
      <input type="range" v-model="r" min="1" max="20">
    </div>
    <div>
      <label>颜色</label>
      <input type="color" v-model="color">
    </div>
    <div>
      <label>阴影模糊级别</label>
      <input type="range" v-model="shadowBlur" min="1" max="20">
    </div>

  </div>
</template>

<script>
//https://segmentfault.com/a/1190000008560571
export default {
  name: "FlowLight.vue",
  components: {},
  data() {
    return {
      ctx: null,
      width: 0,
      height: 0,
      x: 100,
      y: 150,
      r: 2,
      color: '#ffffff',
      shadowBlur: 10,

      //圆形轨迹
      circleConf: {
        centerX: 250,
        centerY: 150,
        radius: 80,
        angle: Math.PI
      },

      //椭圆轨迹
      ellipseConf: {
        a: 100,
        b: 50,
        angle: 0,
        centerX: 250,
        centerY: 150
      }

    }
  },
  watch:{

  },
  mounted() {
    this.init()
    this.render()
  },
  methods: {
    init(){
      const canvas = this.$refs["canvas"]
      const ctx = canvas.getContext("2d")
      this.ctx = ctx
      this.width = canvas.width
      this.height = canvas.height
    },

    render(){
      const {ctx, width, height} = this
      var prev = ctx.globalCompositeOperation
      ctx.globalCompositeOperation = 'destination-in'

      ctx.globalAlpha = 0.97
      ctx.fillRect(0,0, width, height)
      ctx.globalCompositeOperation = prev
      this.draw()

      window.requestAnimationFrame(this.render)
    },

    draw(){
      const {ctx, x, y, r, shadowBlur, color} = this

      ctx.lineWidth = 0
      // ctx.strokeStyle = "#fc0a4b"
      ctx.shadowBlur = shadowBlur
      ctx.shadowColor = color
      ctx.fillStyle = color
      ctx.fill()
      ctx.beginPath()
      ctx.arc( x, y, r, 0, Math.PI * 2 )

      ctx.closePath()

      //直线
      // if (y > this.height || x > this.width) {
      //   this.x = 0;
      //   this.y = 0
      // } else {
      //   this.x += 2
      //   this.y += 2
      // }

      //圆形
      // const {centerX, centerY, radius, angle}  = this.circleConf
      // this.x = centerX + radius * Math.cos(angle)
      // this.y = centerY + radius * Math.sin(angle)
      // if (angle > 2 * Math.PI) {
      //   this.circleConf.angle = 0
      // } else {
      //   this.circleConf.angle += 0.02
      // }

      //椭圆
      // x=a∗cos(t)
      // y=b∗sin(t)
      const {a, b, angle, centerX, centerY } = this.ellipseConf
      this.x = a * Math.cos(angle) + centerX
      this.y = b * Math.sin(angle) + centerY

      if (angle > 2 * Math.PI) {
        this.ellipseConf.angle = 0
      } else {
        this.ellipseConf.angle += 0.02
      }


      //贝塞尔曲线
    },

    hexToRgba(hex, opacity) {
      return 'rgba(' + parseInt('0x' + hex.slice(1, 3)) + ',' + parseInt('0x' + hex.slice(3, 5)) + ','
          + parseInt('0x' + hex.slice(5, 7)) + ',' + opacity + ')';
    }

  }
}
</script>

<style lang="scss" type="text/scss">
canvas {
  background-color: #000;
}
</style>
