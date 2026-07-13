export class Coordinate {
  private readonly _latitude: number
  private readonly _longitude: number

  private constructor(latitude: number, longitude: number) {
    this._latitude = latitude
    this._longitude = longitude
  }

  get latitude() {
    return this._latitude
  }

  get longitude() {
    return this._longitude
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
