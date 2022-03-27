import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

var routes = [{
    path:'/',
    redirect: "/color-hint"
},{
    path: '/index',
    component:()=>import('@/views/Index')
},{
    path:'/color-hint',
    component:()=>import('@/views/ColorHint')
},{
    path:'/webgl-gm',
    component:()=>import('@/views/WebglGM.vue')
},{
    path:'/webgl-round',
    component:()=>import('@/views/WebglRound.vue')
}, {
  path: '/earth',
  component: () => import('@/views/threejs/Earth.vue')
}, {
  path: '/radar',
  component: () => import('@/views/Radar.vue')
}, {
  path: '/lego',
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