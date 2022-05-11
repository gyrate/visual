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

      const {vertex, fragment} = require('@/shader/repeat-grid-move')
      const program = renderer.compileSync(fragment, vertex);
      renderer.useProgram(program);

      //网格
      renderer.uniforms.rows = 20;
      // renderer.uniforms.r = Math.random() * 0.5 + 0.5

      //分型
      renderer.uniforms.center = [0, 0];
      renderer.uniforms.scale = 1;
      renderer.uniforms.iterations = 15;


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
