import { InvalidCoordinateError } from './errors/invalid-coordinate-error'

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
      throw new InvalidCoordinateError()
    }

    if (longitude < -180 || longitude > 180) {
      throw new InvalidCoordinateError()
    }

    return new Coordinate(latitude, longitude)
  }
}
