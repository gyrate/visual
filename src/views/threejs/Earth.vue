<template>
    <div class="wrap">

      <div ref="container" class="container"></div>

    </div>
</template>

<script>
  import * as THREE from 'three'
  import DAT from 'three/examples/jsm/libs/dat.gui.module.js'
  import Stats from 'three/examples/jsm/libs/stats.module.js'

  export default {
    name: 'Earth',
    components: {},
    data() {
      return {}
    },
    async mounted() {
      await this.init()
    },
    methods: {
      init(){

      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
.wrap{
  position: relative;

  .container{
    position:absolute;
    overflow: hidden;
    width:100%;
    height:100vh;
    background-color: #2c3e50;
  }
}
</style>