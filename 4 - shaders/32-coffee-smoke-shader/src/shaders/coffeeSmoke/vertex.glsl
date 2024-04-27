uniform float uTime;
uniform sampler2D uPerlin;

varying vec2 vUv;

#include ./includes/rotate2D.glsl

void main() {
  vec3 newPos = position;

  // twist
  float twistPerlin = texture(
    uPerlin, 
    vec2(0.5, uv.y * 0.2 - uTime * 0.005)
  ).r;
  float angle = twistPerlin * 10.0;
  newPos.xz = rotate2D(newPos.xz, angle);

  // wind
  vec2 windOffset = vec2(
    texture(uPerlin, vec2(.25, uTime * 0.01)).r - 0.5,
    texture(uPerlin, vec2(.75, uTime * 0.01)).r - 0.5
  );
  windOffset *= pow(uv.y, 2.25) * 10.0;
  newPos.xz += windOffset;

  // final pos
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);

  // varyings
  vUv = uv;
}