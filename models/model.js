import mysql from 'mysql2/promise'

const config = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: '123456',
  database: 'USUARIOS'

}

const connection = await mysql.createConnection(config)
// console.log(connection)
export class Usuario {
  static async getAll () {
    const [usuario] = await connection.query(
      'SELECT nombre, contrasena, BIN_TO_UUID(id) id FROM usuario;'
    )
    // console.log(usuario)
    return usuario
  }

  static async getById ({ nombre }) {
    const [usuario] = await connection.query(
      `SELECT * FROM usuario WHERE nombre = '${nombre}' LIMIT 1;`
    )
    // return usuario
    return usuario
  }

  static async create ({ id, nombre, contrasena }) {
    const res = await connection.query(
      'INSERT INTO usuario (id, nombre, contrasena) VALUES (UUID_TO_BIN(?),?,?);',
      [id, nombre, contrasena]
    )
    return res
  }

  static async insertInfoUser ({ edad, ingresos, rangoLaboral, usuarioId }) {
    const res = await connection.query(
      'INSERT INTO info_user (edad, ingresos, rango_laboral, usuario_id) VALUES (?,?,?,UUID_TO_BIN(?));',
      [edad, ingresos, rangoLaboral, usuarioId]
    )
    return res
  }

  static async getCarros () {
    const [usuario] = await connection.query(
      'SELECT * FROM carros;'
    )

    return usuario
  }
}
