uniform float uTime;
uniform sampler2D uPerlin;

varying vec2 vUv;

void main() {
  // scale and animate
  vec2 smokeUv = vUv;
  smokeUv.x *= 0.5;
  smokeUv.y *= 0.3;
  smokeUv.y -= uTime * .03;

  // smoke
  float smoke = texture(uPerlin, smokeUv).r;

  // remap
  smoke = smoothstep(0.4, 1.0, smoke);

  // edges
  smoke *= smoothstep(0.0, 0.1, vUv.x);
  smoke *= smoothstep(1.0, 0.9, vUv.x);
  smoke *= smoothstep(0.0, 0.1, vUv.y);
  smoke *= smoothstep(1.0, 0.4, vUv.y);

  // final col
  gl_FragColor = vec4(0.6, 0.3, 0.2, smoke);
  //gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}