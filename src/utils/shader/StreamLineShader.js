var Shader = {

  // uniforms: {
  //   colorTexture: { type: 'sample2D', value: null },
  //   topColor: { type: 'c', value: 0xff00ff }
  // },

  vertexShader: `
      varying vec2 vUv;
      attribute float percent;
      uniform float u_time;
      uniform float number;
      uniform float speed;
      uniform float length;
      varying float opacity;
      uniform float size;
      void main()
      {
          vUv = uv;
          vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
          float l = clamp(1.0-length,0.0,1.0);
          gl_PointSize = clamp(fract(percent*number + l - u_time*number*speed)-l ,0.0,1.) * size * (1./length);
          opacity = gl_PointSize/size;
          gl_Position = projectionMatrix * mvPosition;
      }
    `,
  fragmentShader: `
      #ifdef GL_ES
      precision mediump float;
      #endif
      varying float opacity;
      uniform vec3 color;
      void main(){
          if(opacity <=0.2){
              discard;
          }
          gl_FragColor = vec4(color, opacity);
      }  
    `
}

export default Shader
