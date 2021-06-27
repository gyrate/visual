/**
 * 经纬度坐标转成3D空间坐标
 *lng:经度
 *lat:维度
 *radius:地球半径
 */
export function lglt2xyz(lng, lat, radius) {
  const phi = (-185 + lng) * (Math.PI / 180)
  const theta = (90 - lat) * (Math.PI / 180)
  return {
    x: -radius * Math.sin(theta) * Math.cos(phi),
    y: radius * Math.cos(theta),
    z: radius * Math.sin(theta) * Math.sin(phi),
  }
}

//threejs自带

// lglt2xyz(lng, lat, radius) {
//   const theta = (90 + lng) * (Math.PI / 180)
//   const phi = (90 - lat) * (Math.PI / 180)
//   return (new THREE.Vector3()).setFromSpherical(new THREE.Spherical(radius, phi, theta))
// }
