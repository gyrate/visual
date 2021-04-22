<template>
  <div>
    <canvas width="300" height="300"></canvas>
  </div>
</template>

<script>

export default {
  name: "WebglGM",
  components: {},
  mounted() {
    
    const canvas = document.querySelector("canvas");
    const gl = canvas.getContext("webgl");

    const vertex = `
      attribute vec2 position;
      varying vec3 color;
      void main() {
        gl_PointSize = 1.0;
        color = vec3(0.5 + position * 0.5, 0.0);
        gl_Position = vec4(position * 0.5, 1.0, 1.0);
      }
    `;

    const fragment = `
      precision mediump float;
      varying vec3 color;
      void main()
      {
        gl_FragColor = vec4(color, 1.0);
      }    
    `;

    //创建着色器
    const vertexShader = gl.createShader(gl.VERTEX_SHADER)
    gl.shaderSource(vertexShader, vertex)
    gl.compileShader(vertexShader)

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragment);
    gl.compileShader(fragmentShader);

    //WebGLProgram 对象，并将这两个 shader 关联到这个 WebGL 程序上
    const program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)

    //们要通过 useProgram 选择启用这个 WebGLProgram 对
    gl.useProgram(program)

    //三角形三个点
    const points = new Float32Array([
        -1,-1,
        0,1,
        1,-1
    ])

    //建一个缓存对象，将它绑定为当前操作对象，再把当前的数据写入缓存对象
    const bufferId = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId)
    gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW)

    //获取顶点着色器中的position变量的地址
    const vPosition = gl.getAttribLocation(program, 'position')
    //给变量设置长度和类型
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0,0)
    //激活这个变量
    gl.enableVertexAttribArray(vPosition)

    //执行着色器程序完成绘制
    gl.clear(gl.COLOR_BUFFER_BIT)
    //gl.TRIANGLES 表示以三角形为图元绘制，再传入绘制的顶点偏移量和顶点数量
    gl.drawArrays(gl.TRIANGLES, 0, points.lenght/2)

    // webgl支持的图元类型有七种，
    // 分别是 gl.POINTS(点), 
    // gl.LINES(线段), 
    // gl.LINE_STRIP(线条), 
    // gl.LINE_LOOP(回路), 
    // gl.TRIANGLES(三角形), 
    // gl.TRIANGLE_STRIP(三角带), 
    // gl.TRIANGLE_FAN(三角扇)。

  },
  methods: {},
};
</script>

<style>
</style>
