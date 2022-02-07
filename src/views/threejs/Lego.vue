<template>
  <div class="lego">
    <div ref="container" class="container"></div>
  </div>
</template>

<script>
  import * as THREE from 'three'
  import DAT from 'three/examples/jsm/libs/dat.gui.module.js'
  import Stats from 'three/examples/jsm/libs/stats.module.js'
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

  export default {
    name: "Lego",
    components: {},
    data() {
      return {
        screenWidth: 0,
        screenHeight: 0,

        renderer: null,
        camera: null,
        scene: null,

        group: null
      }
    },
    mounted() {
      this.initRender() //必要
      this.initCamera() //必要
      this.initScene() //必要
      this.animate() //必要
      this.initLight()
      this.initControls()
      window.addEventListener('resize', this.onWindowResize, false)

      this.initEarth()
      this.initLego()
    },
    methods: {

      onWindowResize() {

        const Dom = this.$refs['container']
        this.screenWidth = Dom.clientWidth
        this.screenHeight = Dom.clientHeight

        this.camera.aspect = this.screenWidth / this.screenHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(this.screenWidth, this.screenHeight)
        this.renders()
      },

      async initEarth(){

        //球体
        const texture = await this.globeTextureLoader('/image/earth/earth.jpg')
        var globeGgeometry = new THREE.SphereGeometry( this.radius, 1000, 1000 );
        var globeMaterial = new THREE.MeshStandardMaterial({
          map: texture,
          side:THREE.DoubleSide
        })
        var globeMesh = new THREE.Mesh(globeGgeometry, globeMaterial)
        this.scene.add( globeMesh )

        this.group = globeMesh

      },

      //获取材质
      globeTextureLoader(url) {
        return new Promise(resolve => {
          var texture = new THREE.TextureLoader().load(url)
          resolve(texture)
        })
      },

      initLego(){

        //生成地面
        const groundGm = new THREE.PlaneGeometry(20,20)
        const groundMt = new THREE.MeshBasicMaterial({color: 0xcccccc, side: THREE.DoubleSide})
        const ground = new THREE.Mesh(groundGm, groundMt)

        //定位
        ground.position.set(0, -2, 0)
        //沿着x轴（红）旋转90度
        ground.rotateX(-Math.PI/2)

        this.scene.add(ground)
      },

      initRender(){
        const Dom = this.$refs['container']
        this.screenWidth = Dom.clientWidth
        this.screenHeight = Dom.clientHeight

        const renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true
        })
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.setSize(this.screenWidth, this.screenHeight)
        Dom.appendChild(renderer.domElement)

        this.renderer = renderer

        const stats = new Stats();
        document.body.appendChild(stats.dom)
      },

      initCamera() {
        this.camera = new THREE.PerspectiveCamera(45, this.screenWidth / this.screenHeight, 1, 10000)
        this.camera.position.set(21, 5, 24)
        this.camera.lookAt(0, 0, 0)

        window.camera = this.camera
      },

      initScene() {
        this.scene = new THREE.Scene()
        this.scene.background = new THREE.Color(0x72b0e6)
        this.scene.fog = new THREE.Fog(0x72b0e6, 200, 500)

        //将AxesHelper 边长为700 加入到场景中
        const axesHelper = new THREE.AxesHelper(700)
        this.scene.add(axesHelper)
      },

      renders(){
        this.renderer.clear()
        this.renderer.render(this.scene, this.camera)
      },

      initControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true; //是否开启阻尼惯性
        this.controls.enableZoom = true;
        this.controls.autoRotate = false;
        this.controls.autoRotateSpeed = 0.2;
        this.controls.enablePan = true;

        this.controls.maxPolarAngle = Math.PI/2  //垂直旋转角度上限
        this.controls.minPolarAngle = Math.PI/3 //垂直旋转角度下限
      },

      initLight(){

        const scene = this.scene
        const ambientLight = new THREE.AmbientLight(0xcccccc, 1.1);
        scene.add(ambientLight);

        var directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
        directionalLight.position.set(1, 0.1, 0).normalize();
        var directionalLight2 = new THREE.DirectionalLight(0xff2ffff, 0.2);
        directionalLight2.position.set(1, 0.1, 0.1).normalize();
        scene.add(directionalLight);
        scene.add(directionalLight2);

        var hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.2);
        hemiLight.position.set(0, 1, 0);
        scene.add(hemiLight);

      },


      animate() {
        const t = this
        window.requestAnimationFrame(() => {
          if (t.controls) {
            t.controls.update();
          }
          // t.group.rotation.y += 0.005
          t.renders()
          t.animate()
        })
      },

    }
  }
</script>

<style lang="scss" type="text/scss">
  .lego {
    position: relative;

    .container{
      position:absolute;
      overflow: hidden;
      width:100%;
      height:100vh;
      background-color: #72b0e6;
    }
  }
</style>
