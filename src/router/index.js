import { createRouter, createWebHashHistory} from "vue-router"

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
    component:()=>import('@/views/WebglGM')
}]

const router = createRouter({
    history: createWebHashHistory(),
    routes: routes,
    // mode:'hash'
// base: process.env.BASE_URL
})

export default router