export class Cpf {
  private readonly _value: string

  private constructor(value: string) {
    this._value = value
  }

  get value() {
    return this._value
  }

  get format() {
    return this._value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  static create(cpf: string): Cpf {
    const cleanCpf = cpf.replace(/\D/g, '')

    if (!this.validate(cleanCpf)) {
      throw new Error('CPF inválido')
    }

    return new Cpf(cleanCpf)
  }

  private static validate(cpf: string): boolean {
    if (cpf.length !== 11) return false

    if (/^(\d)\1{10}$/.test(cpf)) return false

    return true
  }
}
