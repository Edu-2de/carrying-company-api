export interface CoordinateParams {
  latitude: number
  longitude: number
}

export function getBoundingBox(center: CoordinateParams, radiusInKm: number) {
  // 1 grau de latitude equivale a aproximadamente 111.32 km
  const latDelta = radiusInKm / 111.32

  // 1 grau de longitude varia dependendo da latitude atual
  const lonDelta =
    radiusInKm / (111.32 * Math.cos(center.latitude * (Math.PI / 180)))

  return {
    minLat: center.latitude - latDelta,
    maxLat: center.latitude + latDelta,
    // Math.abs garante que lidemos corretamente com valores negativos
    minLng: center.longitude - Math.abs(lonDelta),
    maxLng: center.longitude + Math.abs(lonDelta),
  }
}
