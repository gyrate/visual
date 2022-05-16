<template>
  <div class="image-filter">

    <div>
      <h1 class="title">滤镜</h1>
      <canvas width="500" height="500" ref="canvas1"></canvas>
      
      <section>
        <div class="field" v-for="(item,key) in filterMap" :key="key">
          <label>{{ item.text }}</label>
          <input type="number" :min="item.min" :max="item.max" v-model="item.value"/>
          <span>( {{item.min}} - {{item.max}} )</span>
          <input type="button" @click="refreshFilter(key)" value="执行">
        </div>
        <div  class="field">
          <input type="button" @click="initFilter" value="重置">
        </div>
      </section>
      
      <section>
        <div class="field" v-for="(item,key) in gaussMap" :key="`gaussMap_${key}`">
          <label>{{ item.text }}</label>
          <input type="number" :min="item.min" :max="item.max" v-model="item.value"/>
          <span>( {{item.min}} - {{item.max}} )</span>
        </div>
        <div  class="field">
          <input type="button" @click="setGauss" value="高斯模糊">
        </div>
      </section>
      
      <section>
        <div class="field" v-for="(item,key) in magniferMap" :key="`magnifer_${key}`">
          <label>{{ item.text }}</label>
          <input type="number" :min="item.min" :max="item.max" v-model="item.value"/>
          <span>( {{item.min}} - {{item.max}} )</span>
        </div>
        <div class="field">
          <label>鼠标跟随 <input type="checkbox" v-model="moveFollow" /></label> {{moveFollow}}
        </div>
        <div  class="field">
          <input type="button" @click="setMagnifer" value="局部放大">
        </div>
      </section>
      
    </div>

  </div>
</template>

<script>

import {loadImage, getImageData, traverse, gaussianBlur, magnifer} from "@/utils/imageFilter";
import * as ColorMatrix from '@/utils/color-matrix';

const imgUrl = './image/golf.png'

export default {
  name: "ImageFilter",
  components: {},
  data(){
    return {
      filterMap:  {
        grayscale: {value: 0.5, min: 0, max: 1, text: '灰度'},
        saturate:  {value: 0.5, min: 0, max: 1, text: '饱和度'},
        brightness: {value:0.5, min: 0, max: 10, text: '亮度'},
        contrast:  {value: 0.5, min: 0, max: 10, text: '对比度'},
        invert:  {value: 0.5, min: 0, max: 1, text: '反色'},
        opacity: {value: 0.5, min:0,max: 1,text:'透明度'},
        sepia: {value: 0.5, min:0,max: 1,text:'sepia'},
        hueRotate: {value: 50, min:0, max: 360,text:'色相'},
      },
      gaussMap:{
        radius: {value: 3, min: 1,max: 100, text:'取值半径'},
        // sigma: {value: 1, min: 1,max: 100, text:'标准方差'},
      },
      magniferMap:{
        x:{value: 420, min:0, max: 1000, text: '区域中心x'},
        y:{value: 210, min:0, max: 500, text: '区域中心y'},
        radius: {value: 60, min: 10, max: 300, text: '放大半径'}
      },
      moveFollow: false,
      orgImageDataArr: []
    }
  },
  mounted() {
    this.init();
  },

  methods: {

    init() {
      this.initFilter()

      this.$refs['canvas1'].addEventListener('mousemove', (e)=>{
        console.log(e.clientX + ',' + e.clientY)
        this.moveFollow && this.setMagnifer(e)
      })
    },

    setGauss(){

      const canvas = this.$refs['canvas1']
      const context = canvas.getContext('2d');
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
      const {radius, sigma} = this.gaussMap

      gaussianBlur(imageData.data,  canvas.width, canvas.height, parseFloat(radius.value))
      canvas.width = imageData.width;
      canvas.height = imageData.height;
      context.putImageData(imageData, 0, 0);

    },

    setMagnifer(event){

      const canvas = this.$refs['canvas1']
      const context = canvas.getContext('2d');
      // const imageData = context.getImageData(0, 0, canvas.width, canvas.height)

      const imageData = new ImageData(new Uint8ClampedArray(this.orgImageDataArr),canvas.width, canvas.height)

      const {radius, x, y} = this.magniferMap
      const {clientX, clientY} = event

      magnifer(imageData.data, canvas.width, canvas.height, 1.2, {
        magniferR: radius.value,
        centerX: clientX,
        centerY: clientY,
        // centerX: x.value,
        // centerY: y.value
      })
      canvas.width = imageData.width;
      canvas.height = imageData.height;
      context.putImageData(imageData, 0, 0);

    },

    refreshFilter(key){

      const canvas = this.$refs['canvas1']
      const context = canvas.getContext('2d');
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height)

      const {transformColor} = ColorMatrix
      const matrixArr = ColorMatrix[key](this.filterMap[key].value)

      // 遍历 imageData 数据对象
      traverse(imageData, ({r, g, b, a}) => {
        return transformColor(
            [r, g, b, a],
            matrixArr
        )
      })

      canvas.width = imageData.width;
      canvas.height = imageData.height;
      context.putImageData(imageData, 0, 0);

    },

    async initFilter() {
      const canvas = this.$refs['canvas1']
      const context = canvas.getContext('2d');
      // 异步加载图片
      const img = await loadImage(imgUrl);
      // 获取图片的imageData 数据对象
      const imageData = getImageData(img);
      this.orgImageDataArr = [...imageData.data]
      // 更新canvas内容
      canvas.width = imageData.width;
      canvas.height = imageData.height;
      context.putImageData(imageData, 0, 0);

    }


  }
};
</script>

<style lang="scss">
.image-filter {

  section{
    margin: 0.5em 0;
    padding: .5em;
    border: 1px solid #ccc;

    .field{
      padding: 0.5em 0;
    }
  }
  input[type=number] {
    margin: 0 0.5em;
  }
  input[type=button] {
    margin: 0 1em;
  }
  .title{
    padding: .5em;
    font-size: 16px;
  }

  canvas {

  }
}
</style>
