export class Coordinate {
  private readonly latitude: number
  private readonly longitude: number

  private constructor(latitude: number, longitude: number) {
    this.latitude = latitude
    this.longitude = longitude
  }

  get getLatitude() {
    return this.latitude
  }

  get getLongitude() {
    return this.longitude
  }

  static create(latitude: number, longitude: number): Coordinate {
    if (latitude < -90 || latitude > 90) {
      throw new Error('Latitude inválida. Deve estar entre -90 e 90.')
    }

    if (longitude < -180 || longitude > 180) {
      throw new Error('Longitude inválida. Deve estar entre -180 e 180.')
    }

    return new Coordinate(latitude, longitude)
  }
}
