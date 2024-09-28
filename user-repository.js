// import DBLocal from 'db-local'
import bcrypt from 'bcrypt'
import { SALT_ROUNDS } from './config.js'
import { Usuario } from './models/model.js'
console.log(await Usuario.getAll())
// console.log(Usuario.getById('carlosf'))

// const { Schema } = new DBLocal({ path: './db' })

// const User = Schema('User', {
//   _id: { type: String, required: true },
//   username: { type: String, required: true },
//   password: { type: String, required: true }
// })

export class UserRepository {
  static async create ({ username, password }) {
    Validation.username(username)
    Validation.password(password)

    // 2.ASEGURARSE QUE EL USERNAME NO EXISTA
    // const usuario = await Usuario.getAll().findOne({ username })

    const r = await Usuario.getAll(username)
    // console.log(r.nombre)
    const [{ contrasena: _, ...publicUser }] = r

    const h = publicUser.nombre === username
    console.log(h)
    if (h) throw new Error('Este usuario ya existe')

    const ids = crypto.randomUUID()
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    await Usuario.create({
      id: ids,
      nombre: username,
      contrasena: hashedPassword
    })
    // console.log(Usuario)
    // User.create({
    //    _id: id,
    //   usernam,
    //   password: hashedPassword
    // }).save()

    return ids
  }

  static async login ({ username, password }) {
    Validation.username(username)
    Validation.password(password)

    const res = await Usuario.getById({ nombre: username })
    const [{ ...salida }] = await res
    // console.log(salida.password)

    // const user = User.findOne({ username })
    // const r = await Usuario.getAll({ nombre: username })

    if (!salida.nombre) throw new Error('Invalid username or password')

    const isValido = await bcrypt.compareSync(password, salida.contrasena)
    if (!isValido) throw new Error('Invalid username or password')

    const [{ contrasena: _, ...result }] = await res
    console.log('.....')

    // const { password: _, ...publicUser } = user
    const hex = result.id.toString('hex')
    const arreay = [
      hex.slice(0, 8),
      hex.slice(8, 12),
      hex.slice(12, 16),
      hex.slice(16, 20),
      hex.slice(20)
    ].join('-')
    console.log(arreay)

    return {
      id: arreay,
      nombre: result.nombre
    }
    // return publicUser
  }

  static async InfoUser ({ nombre, edad, ingresos, rangoLaboral }) {
    const res = await Usuario.getById({ nombre })
    const [{ ...salida }] = await res

    const hex = salida.id.toString('hex')
    const arreay = [
      hex.slice(0, 8),
      hex.slice(8, 12),
      hex.slice(12, 16),
      hex.slice(16, 20),
      hex.slice(20)
    ].join('-')
    console.log('.....')
    console.log(salida.nombre)
    if (salida.nombre === nombre) {
      // Validation.inserInfoUser(edad, ingresos, rangoLaboral)
      await Usuario.insertInfoUser({
        edad,
        ingresos,
        rangoLaboral,
        usuarioId: arreay
      })
    }
  }

  static async getCarros () {
    const carros = await Usuario.getCarros()
    console.log(carros)
    return carros
  }
}

class Validation {
  static username (username) {
    if (typeof username !== 'string') throw new Error('Username must be a string')
    if (username.length < 3) throw new Error('Username must be at least 3 characters long')
  }

  static password (password) {
    if (typeof password !== 'string') throw new Error('Password must be a string')
    if (password.length < 6) throw new Error('Password must be at least 6 characters long')
  }

  static inserInfoUser (edad, ingresos, rangoLaboral, usuarioId) {
    if (typeof edad !== 'string') throw new Error('Edad must be a number')
    if (!isNaN(ingresos) && ingresos.trim() !== '') throw new Error('Ingresos must be a number')
    if (!isNaN(rangoLaboral) && rangoLaboral.trim() !== '') throw new Error('Rango laboral must be a string')
    // if (typeof usuarioId !== 'string') throw new Error('UsuarioId must be a string')
  }
}
