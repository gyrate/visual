<template>
  <div class="flow-light">
    <h3>流光效果</h3>
    <canvas width="500" height="300" ref="canvas"></canvas>

    <section>
      <label>半径</label>
      <input type="range" v-model="r" min="1" max="20">
    </section>
    <section>
      <label>颜色</label>
      <input type="color" v-model="color">
    </section>
    <section>
      <label>阴影模糊级别</label>
      <input type="range" v-model="shadowBlur" min="1" max="20">
    </section>
    <section>
      <label>轨迹类型</label>
      <input type="button" v-for="(item,index) in rayList" :value="item.label" :key="index" @click="changeRay(index)"/>
    </section>
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

      rayList: [
        {label:'直线',id: 'line'},
        {label:'圆形',id: 'circle'},
        {label:'椭圆',id: 'ellipse'},
        {label:'2阶贝塞尔',id: 'twoBezier'},
        {label:'3阶贝塞尔',id: 'threeBezier'},
        {label:'折线',id: 'threeBezier'},
      ],
      currRayId: 'polyline',

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

      //3阶贝塞尔
      threeBezierConf:{
        p1: [100,100], //起点坐标
        p2: [400, 100],//终点坐标
        cp1: [100,250], //拐点1坐标
        cp2: [400,250], //拐点2坐标
        t: 0,
      },

      //连续折线
      polyline: {
        path: [
          {x: 100, y: 100},
          {x: 150, y: 100},
          {x: 200, y: 250},
          {x: 180, y: 200},
          {x: 450, y: 280},
          {x: 400, y: 100},
        ]
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
      //默认值为source-over
      var prev = ctx.globalCompositeOperation;

      //只显示canvas上原图像的重叠部分
      ctx.globalCompositeOperation = 'destination-in';

      //设置主canvas的绘制透明度
      ctx.globalAlpha = 0.95;

      //这一步目的是将canvas上的图像变的透明
      ctx.fillRect(0, 0, width, height);

      //在原图像上重叠新图像
      ctx.globalCompositeOperation = prev;

      //在主canvas上画新圆
      this.draw()

      window.requestAnimationFrame(this.render)
    },

    draw(){
      const {ctx, x, y, r, shadowBlur, color} = this

      ctx.beginPath()
      ctx.lineWidth = 0
      ctx.shadowBlur = shadowBlur
      ctx.shadowColor = color
      ctx.fillStyle = color
      ctx.arc( x, y, r, 0, Math.PI * 2 )
      ctx.closePath()
      ctx.fill()

      this.updateXY()
    },

    updateXY(){

      switch(this.currRayId){
        case 'line':
          //直线
          this.updateLine()
          break;
        case 'circle':
          //圆形
          this.updateCircle()
          break;
        case 'ellipse':
          //椭圆：x=a∗cos(t) , y=b∗sin(t)
          this.updateEllipse()
          break;
        case 'twoBezier':
          //2阶贝塞尔曲线
          this.updateTwoBezier()
          break;
        case 'threeBezier':
          //3阶段贝塞尔曲线
         this.updateThreeBezier()
          break;
        case 'polyline':
          if(!this.polylinePoints){
            this.initPolyline()
          }
          this.updatePolyline()
          break;
        default:
          break;
      }
    },

    initPolyline(){
      //路径节点
      this.polylinePoints = this.polyline.path
      const {x, y} = this.polylinePoints[0]
      this.x = x
      this.y = y
      //当前分段索引值
      this.currLineIndex = 0
      //当前分段长度
      this.currLineLen = this.getCurrLineLen()
      //移动速度
      //todo:缓动函数
      this.speed = 2
    },
    //获取当前分段的长度
    getCurrLineLen(){
      const currIndex = this.currLineIndex
      const nextIndex = (this.currLineIndex + 1) % this.polylinePoints.length
      return Math.sqrt((this.polylinePoints[nextIndex].x - this.polylinePoints[currIndex].x) ** 2 + (this.polylinePoints[nextIndex].y - this.polylinePoints[currIndex].y) ** 2)
    },

    // 折线路径移动轨迹的实现方式按分段处理
    // 每个分段计算xy的直线移动位置，如果目标位置超出线段，则进入下一个分段处理
    updatePolyline(){

      const {x, y} = this
      const start = this.polylinePoints[this.currLineIndex]
      const target = this.polylinePoints[(this.currLineIndex + 1)%this.polylinePoints.length]

      let newX = x + (target.x - start.x) * this.speed / this.currLineLen
      let newY = y + (target.y - start.y) * this.speed / this.currLineLen

      if (Math.abs(newX - x) > Math.abs(target.x - x) || Math.abs(newY - y) > Math.abs(target.y - y)) {
        //x,y超过直线终点，则换到下一段
        this.currLineIndex = (this.currLineIndex + 1) % this.polylinePoints.length
        this.currLineLen = this.getCurrLineLen()
        this.x = this.polylinePoints[this.currLineIndex].x
        this.y = this.polylinePoints[this.currLineIndex].y
      } else {
        this.x = newX
        this.y = newY
      }

    },

    updateLine(){
      const {x, y} = this
      if (y > this.height || x > this.width) {
        this.x = 0;
        this.y = 0
      } else {
        this.x += 2
        this.y += 2
      }
    },

    updateCircle(){
      const {centerX, centerY, radius, angle}  = this.circleConf
      this.x = centerX + radius * Math.cos(angle)
      this.y = centerY + radius * Math.sin(angle)
      if (angle > 2 * Math.PI) {
        this.circleConf.angle = 0
      } else {
        this.circleConf.angle += 0.02
      }
    },

    updateEllipse(){
      const {a, b, angle, centerX, centerY } = this.ellipseConf
      this.x = a * Math.cos(angle) + centerX
      this.y = b * Math.sin(angle) + centerY

      if (angle > 2 * Math.PI) {
        this.ellipseConf.angle = 0
      } else {
        this.ellipseConf.angle += 0.02
      }
    },

    updateTwoBezier(){
      const {p1, p2, cp, t} = this.twoBezierConf
      const [x1, y1] = this.twoBezier(t, p1, cp, p2)
      this.x = x1
      this.y = y1
      if (t > 1) {
        this.twoBezierConf.t = 0
      } else {
        this.twoBezierConf.t += 0.005
      }
    },

    updateThreeBezier(){
      const {t, p1, cp1, cp2, p2} = this.threeBezierConf
      const [x1, y1] = this.threeBezier(t, p1, cp1, cp2, p2)
      this.x = x1
      this.y = y1
      if (t > 1) {
        this.threeBezierConf.t = 0
      } else {
        this.threeBezierConf.t += 0.005
      }
    },

    //调整流光路径
    changeRay(index){
      this.x = 100
      this.y = 150
      this.currRayId = this.rayList[index].id
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
.flow-light{
  canvas {
    background-color: #000;
  }
  section{
    padding: .2em;
    input[type=button]{
      margin: 0 .2em;
    }
  }
}

</style>
