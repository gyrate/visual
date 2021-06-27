<template>
    <div class="wrap">

      <div ref="container" class="container"></div>

    </div>
</template>

<script>
  import axios from 'axios'
  import * as THREE from 'three'
  import DAT from 'three/examples/jsm/libs/dat.gui.module.js'
  import Stats from 'three/examples/jsm/libs/stats.module.js'
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
  import {lglt2xyz} from '@/utils/index'


  let renderer, camera, scene, light, controls;
  let group, groupHalo

  export default {
    name: 'Earth',
    components: {},
    data() {
      return {
        width: 0,
        height: 0,
        radius: 100
      }
    },
    mounted() {
      this.initRender()
      this.initCamera()
      this.initScene()
      this.initLight()

      this.initControls()
      this.animate()
      window.addEventListener('resize', this.onWindowResize, false)

      group = new THREE.Group();
      scene.add( group);
      groupHalo = new THREE.Group()
      scene.add( groupHalo);

      this.initBg()
      this.initEarth()
      this.initHalo()
      this.initMarkers()
    },
    methods: {
      initRender(){
        const Dom = this.$refs['container']
        this.width = Dom.clientWidth
        this.height = Dom.clientHeight

        //初始化渲染器
        renderer = new THREE.WebGLRenderer( {
          antialias: true, //抗锯齿
          alpha: true
        } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( this.width, this.height );
        Dom.appendChild( renderer.domElement );
      },
      renders(){
        renderer.clear();
        renderer.render( scene, camera );
      },
      //初始化相机
      initCamera() {
        camera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 10000);
        camera.position.set(5, -20, 200);
        camera.lookAt(0, 3, 0);
        window.camera = camera;
      },

      //渲染场景
      initScene() {
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x020924);
        scene.fog = new THREE.Fog(0x020924, 200, 1000);
        window.scene = scene;
      },

      /**
       * 初始化用户交互
       **/
      initControls() {
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.enableZoom = true;
        controls.autoRotate = false;
        controls.autoRotateSpeed = 2;
        controls.enablePan = true;
      },

      onWindowResize() {
        camera.aspect = this.width / this.height
        camera.updateProjectionMatrix()
        renderer.setSize(this.width, this.height)
        this.renders()
      },

      //更新
      animate() {
        const t = this
        window.requestAnimationFrame(() => {
          if (controls) {
            controls.update();
          }
          t.renders();
          t.animate();
        });
      },

      initLight() {
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

        var directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.set(1, 500, -20);
        directionalLight.castShadow = true;
        directionalLight.shadow.camera.top = 18;
        directionalLight.shadow.camera.bottom = -10;
        directionalLight.shadow.camera.left = -52;
        directionalLight.shadow.camera.right = 12;
        scene.add(directionalLight);
      },

      initBg(){
        const positions = [];
        const colors = [];
        const geometry = new THREE.BufferGeometry();
        for (var i = 0; i < 10000; i ++) {
          var vertex = new THREE.Vector3();
          vertex.x = Math.random() * 2 - 1;
          vertex.y = Math.random() * 2 - 1;
          vertex.z = Math.random() * 2 - 1;
          positions.push( vertex.x, vertex.y, vertex.z );
          var color = new THREE.Color();
          color.setHSL( Math.random() * 0.2 + 0.5, 0.55, Math.random() * 0.25 + 0.55 );
          colors.push( color.r, color.g, color.b );
        }
        geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
        geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

        //材质
        const texture = THREE.ImageUtils.loadTexture("/image/earth/star.png");
        var starsMaterial = new THREE.ParticleBasicMaterial( {
          map: texture,
          size: 1,
          transparent: true,
          opacity: 1,
          vertexColors: true, //true：且该几何体的colors属性有值，则该粒子会舍弃第一个属性--color，而应用该几何体的colors属性的颜色
          blending: THREE.AdditiveBlending,
          sizeAttenuation: true
        } );

        let stars = new THREE.ParticleSystem( geometry, starsMaterial );
        stars.scale.set( 300, 300, 300 );
        scene.add( stars );

      },

      async initEarth(){

        group.rotation.set( 0.5, 2.9, 0.1 );

        //球体
        const texture = await this.globeTextureLoader('/image/earth/earth.jpg')
        var globeGgeometry = new THREE.SphereGeometry( this.radius, 100, 100 );
        var globeMaterial = new THREE.MeshStandardMaterial({
          map: texture
        })
        var globeMesh = new THREE.Mesh(globeGgeometry, globeMaterial)
        group.add( globeMesh );

        //大气层
        const texture2 =  await this.globeTextureLoader('/image/earth/earth_aperture.png')
        var spriteMaterial = new THREE.SpriteMaterial({
          map: texture2,
          transparent: true,
          opacity:1,
          depthWrite: false
        })
        var aperture = new THREE.Sprite(spriteMaterial)
        aperture.scale.set(this.radius * 3, this.radius * 3, 1)
        group.add(aperture)
      },

      //星环
      async initHalo(){

        //星环
        const texture =  await this.globeTextureLoader('/image/earth/halo.png')
        var geometry = new THREE.PlaneGeometry(this.radius * 3, this.radius * 3)
        var material = new THREE.MeshLambertMaterial({
          map: texture,
          transparent: true,
          side: THREE.DoubleSide,
          depthWrite: false
        })
        var mesh = new THREE.Mesh( geometry, material )
        groupHalo.add(mesh)

        this.initSatellite()
      },

      //卫星
      async initSatellite(){

        const dis = this.radius * 1.5

        const texture =  await this.globeTextureLoader('/image/earth/smallEarth.png')
        var p1 = new THREE.Vector3( -dis, 0, 0 );
        var p2 = new THREE.Vector3( dis, 0, 0 );
        const points = [ p1,p2];
        const geometry = new THREE.BufferGeometry().setFromPoints( points );
        var material = new THREE.PointsMaterial({
          map: texture,
          transparent: true,
          side: THREE.DoubleSide,
          size: 20,
          depthWrite: false
        });
        var statellite = new THREE.Points(geometry, material)
        groupHalo.rotation.set( 2, 0.5, 0 )
        groupHalo.add(statellite)
      },

      //球面上的点标注
      async initMarkers(){
        const texture = await this.globeTextureLoader(`/image/earth/biaozhu.png`)
        const texture1 = await this.globeTextureLoader(`/image/earth/biaozhu1.png`)
        const data = await  this.fetchData(`/mock/provinces.json`)

        data.forEach(item => {
          const [lng, lat] = item.center.split(',')
          const pos = lglt2xyz(lng, lat, this.radius )
          let mark = this.createPointMesh(pos, texture)
          let bar = this.createLightbar(pos, texture1)
          group.add(mark, bar)
        })
      },

      //标注
      createPointMesh( pos, texture ) {
        var planGeometry = new THREE.PlaneGeometry()
        var material = new THREE.MeshBasicMaterial( {
          map: texture,
          transparent: true, //使用背景透明的png贴图，注意开启透明计算
          // side: THREE.DoubleSide, //双面可见
          depthWrite: false, //禁止写入深度缓冲区数据
        } );
        var mesh = new THREE.Mesh( planGeometry, material );
        var size = this.radius * 0.02;//矩形平面Mesh的尺寸
        mesh.scale.set( size, size, size );//设置mesh大小
        //设置mesh位置
        mesh.position.set( pos.x, pos.y, pos.z );
        // mesh在球面上的法线方向(球心和球面坐标构成的方向向量)
        var coordVec3 = new THREE.Vector3( pos.x, pos.y, pos.z ).normalize();
        // mesh默认在XOY平面上，法线方向沿着z轴new THREE.Vector3(0, 0, 1)
        var meshNormal = new THREE.Vector3( 0, 0, 1 );
        // 四元数属性.quaternion表示mesh的角度状态
        //.setFromUnitVectors();计算两个向量之间构成的四元数值
        mesh.quaternion.setFromUnitVectors( meshNormal, coordVec3 );
        return mesh;
      },

      createLightbar(pos, texture){

        var plane = new THREE.PlaneGeometry(50,100)
        var material = new THREE.MeshPhongMaterial({
          //设置矩形网格模型的纹理贴图(光柱特效)
          map: texture,
          // 双面显示
          side: THREE.DoubleSide,
          // 开启透明效果，否则颜色贴图map的透明不起作用
          transparent: true,
          color: '#0dfdf8'
        });
        var mesh = new THREE.Mesh(plane, material);
        var size = this.radius * 0.001;//矩形平面Mesh的尺寸
        mesh.scale.set( size, size, size );//设置mesh大小
        mesh.position.set( pos.x, pos.y, pos.z );

        var coordVec3 = new THREE.Vector3( pos.x, pos.y, pos.z ).normalize();
        var meshNormal = new THREE.Vector3( 0, 1, 0 );
        mesh.quaternion.setFromUnitVectors( meshNormal, coordVec3 );

        //创建一个复制 并旋转90度
        var mesh2 = mesh.clone().rotateY(Math.PI / 2)
        var groupMesh = new THREE.Group()
        groupMesh.add(mesh, mesh2)

        return groupMesh
      },

      //获取材质
      globeTextureLoader(url) {
        return new Promise(resolve => {
          // var texture = THREE.ImageUtils.loadTexture(url)
          var texture = new THREE.TextureLoader().load(url)
          resolve(texture)
        })
      },

      fetchData(url) {
        return new Promise(resolve => {
          axios.get(url).then(res => {
            resolve(res.data)
          })
        })
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