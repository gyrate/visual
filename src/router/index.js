import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

var routes = [{
    path:'/',
    redirect: "/flow-light"
},{
    path: '/index',
    meta: {title: '首页'},
    component:()=>import('@/views/Index')
},{
    path:'/color-hint',
    meta: {title: '颜色的构成'},
    component:()=>import('@/views/ColorHint')
},{
  path:'/flow-light',
  meta: {title: '流光'},
  component:()=>import('@/views/FlowLight')
},{
    path:'/webgl-gm',
    meta: {title: '着色器'},
    component:()=>import('@/views/WebglGM.vue')
},{
    path:'/webgl-round',
    meta: {title: '着色器'},
    component:()=>import('@/views/WebglRound.vue')
},{
  path:'/webgl-repeat',
  component:()=>import('@/views/WebglRepeat.vue')
}, {
  path:'/image-filter',
  component:()=>import('@/views/ImageFilter.vue')
}, {
  path: '/earth',
  meta: {title: 'threejs 地球'},
  component: () => import('@/views/threejs/Earth.vue')
}, {
  path: '/radar',
  meta: {title: 'canvas 雷达'},
  component: () => import('@/views/Radar.vue')
}, {
  path: '/lego',
  meta: {title: 'threejs 坐标系'},
  component: () => import('@/views/threejs/Lego.vue')
}]

const router = new VueRouter({
  routes: routes.concat([
    {
      path: '/404',
      component: () => import('@/views/error-page/404')
    },
    {
      path: '*',
      redirect: '/404',
      hidden: true
    }
  ])
})

export default router
