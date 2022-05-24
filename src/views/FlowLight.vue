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
//流光效果核心代码
//https://blog.csdn.net/LaineGates/article/details/105745843
//椭圆计算公式
//https://segmentfault.com/a/1190000018597975
//贝塞尔曲线计算公式
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
        a: 100, //长半径
        b: 70, //短半径
        angle: 0, //弧度
        centerX: 250, //中心点x
        centerY: 150 //中心点y
      },

      //2阶贝塞尔
      twoBezierConf: {
        p1: [100,100], //起点坐标
        p2: [400, 100],//终点坐标
        cp: [250,200], //拐点坐标
        t: 0,
      },



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

      //椭圆：x=a∗cos(t) , y=b∗sin(t)
      // const {a, b, angle, centerX, centerY } = this.ellipseConf
      // this.x = a * Math.cos(angle) + centerX
      // this.y = b * Math.sin(angle) + centerY
      //
      // if (angle > 2 * Math.PI) {
      //   this.ellipseConf.angle = 0
      // } else {
      //   this.ellipseConf.angle += 0.02
      // }

      //2阶贝塞尔曲线
      const {p1, p2, cp, t} = this.twoBezierConf
      const [x1, y1] = this.twoBezier(t, p1, cp, p2)
      this.x = x1
      this.y = y1
      if (t > 1) {
        this.twoBezierConf.t = 0
      } else {
        this.twoBezierConf.t += 0.005
      }

      //3阶段贝塞尔曲线
      // const

    },

    /**
     * @desc 二阶贝塞尔
     * @param {number} t 当前百分比
     * @param {Array} p1 起点坐标
     * @param {Array} p2 终点坐标
     * @param {Array} cp 控制点
     */
    twoBezier(t, p1, cp, p2) {
      const [x1, y1] = p1;
      const [cx, cy] = cp;
      const [x2, y2] = p2;
      let x = (1 - t) * (1 - t) * x1 + 2 * t * (1 - t) * cx + t * t * x2;
      let y = (1 - t) * (1 - t) * y1 + 2 * t * (1 - t) * cy + t * t * y2;
      return [x, y];
    },

    /**
     * @desc 三阶贝塞尔
     * @param {number} t 当前百分比
     * @param {Array} p1 起点坐标
     * @param {Array} p2 终点坐标
     * @param {Array} cp1 控制点1
     * @param {Array} cp2 控制点2
     */
    threeBezier(t, p1, cp1, cp2, p2) {
      const [x1, y1] = p1;
      const [x2, y2] = p2;
      const [cx1, cy1] = cp1;
      const [cx2, cy2] = cp2;
      let x =
          x1 * (1 - t) * (1 - t) * (1 - t) +
          3 * cx1 * t * (1 - t) * (1 - t) +
          3 * cx2 * t * t * (1 - t) +
          x2 * t * t * t;
      let y =
          y1 * (1 - t) * (1 - t) * (1 - t) +
          3 * cy1 * t * (1 - t) * (1 - t) +
          3 * cy2 * t * t * (1 - t) +
          y2 * t * t * t;
      return [x, y];
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
