<template>
  <div>
    <section>
      <h1>灰色滤镜</h1>
      <canvas width="500" height="500" ref="canvas1"></canvas>
    </section>
    <section>
      <h2></h2>
      <canvas width="500" height="500" ref="canvas2"></canvas>
    </section>

  </div>
</template>

<script>

import {loadImage, getImageData, traverse} from "@/utils/imageFilter";

export default {
  name: "ImageFilter",
  components: {},
  mounted() {
    this.init();
  },
  methods: {

    init() {
      this.filterGray()
    },

    async filterGray() {
      const canvas = this.$refs['canvas1']
      const context = canvas.getContext('2d');
      // 异步加载图片
      const img = await loadImage('https://p2.ssl.qhimg.com/d/inn/4b7e384c55dc/girl1.jpg');
      // 获取图片的imageData 数据对象
      const imageData = getImageData(img);
      // 遍历 imageData 数据对象
      traverse(imageData, ({r, g, b, a}) => {
        const v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        return [v, v, v, a];
      });
      // 更新canvas内容
      canvas.width = imageData.width;
      canvas.height = imageData.height;
      context.putImageData(imageData, 0, 0);
    }


  }
};
</script>

<style>
</style>
