void main() {
  float distanceToCenter = distance(vec2(0.5), gl_PointCoord);
  float strength = .05 / distanceToCenter - 0.1;
  gl_FragColor = vec4(0.8, 1.0, 0.5, strength);
}