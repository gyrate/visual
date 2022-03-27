<template>
  <div class="canvas-radar">
    <canvas width="300" height="300" ref="canvas"></canvas>
  </div>
</template>

<script>
  export default {
    name: 'Radar',
    components: {},
    data() {
      return {
        canvas: null,
        angle: 0,
        width: 0,
        height: 0,
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        const canvas = this.$refs['canvas']
        this.ctx = canvas.getContext('2d')
        this.width = canvas.width
        this.height = canvas.height
        this.update()
        // this.draw()
      },
      update(){
        this.draw()
        this.angle += 0.01

        window.requestAnimationFrame(this.update)
      },
      draw(){
        let ctx = this.ctx
        ctx.clearRect(0, 0, this.width, this.height);

        ctx.beginPath()
        ctx.strokeStyle = "#999999";
        ctx.lineWidth  = 2;
        ctx.arc(150, 150, 100, 0 * Math.PI, 2 * Math.PI)
        ctx.stroke()

        ctx.beginPath()
        ctx.strokeStyle = "#999999";
        ctx.lineWidth  = 1;
        ctx.arc(150, 150, 50, 0 * Math.PI, 2 * Math.PI)
        ctx.stroke()

        ctx.beginPath()
        ctx.strokeStyle = "#999999";
        ctx.lineWidth  = 1;
        ctx.arc(150, 150, 1, 0 * Math.PI, 2 * Math.PI)
        ctx.stroke()

        let angle = this.angle
        let rd = 100
        let offset = this.width /2

        ctx.beginPath();
        ctx.moveTo(150, 150);
        // ctx.arc(150, 150, rd, 0, 2 * Math.PI)
        ctx.arc(150, 150, rd, angle - 0.25 *Math.PI, angle + 0.25 * Math.PI)
        // var lg1 = ctx.createLinearGradient(0, 90, 0, 180)
        var lg1 = ctx.createLinearGradient(
          offset - rd * Math.sin(angle),
          offset + rd * Math.cos(angle),
          offset + rd * Math.sin(angle),
          offset - rd * Math.cos(angle)
        )
        lg1.addColorStop(0, 'rgba(0, 255, 0, 1)')
        lg1.addColorStop(0.5, 'rgba(0, 255, 0, 0.0)')
        lg1.addColorStop(1, 'rgba(0, 255, 0, 0)')
        ctx.fillStyle = lg1
        ctx.fill()
        ctx.closePath()

      }
    }
  }
</script>

<style lang="scss" scoped>
.canvas-radar{
  canvas{
    background-color: azure;
  }
}
</style>