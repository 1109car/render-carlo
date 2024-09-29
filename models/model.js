import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

// Usar la variable de entorno para la conexión
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
})

export class Usuario {
  static async getAll () {
    const { rows: usuario } = await pool.query(
      'SELECT nombre, contrasena, id::uuid as id FROM usuario;'
    )
    return usuario
  }

  static async getById ({ nombre }) {
    const { rows: usuario } = await pool.query(
      'SELECT * FROM usuario WHERE nombre = $1 LIMIT 1;',
      [nombre]
    )
    return usuario
  }

  static async create ({ id, nombre, contrasena }) {
    const res = await pool.query(
      'INSERT INTO usuario (id, nombre, contrasena) VALUES ($1::uuid, $2, $3);',
      [id, nombre, contrasena]
    )
    return res
  }

  static async insertInfoUser ({ edad, ingresos, rangoLaboral, usuarioId }) {
    const res = await pool.query(
      'INSERT INTO info_user (edad, ingresos, rango_laboral, usuario_id) VALUES ($1, $2, $3, $4::uuid);',
      [edad, ingresos, rangoLaboral, usuarioId]
    )
    return res
  }

  static async getCarros () {
    const { rows: usuario } = await pool.query(
      'SELECT * FROM carros;'
    )
    return usuario
  }
}

// import mysql from 'mysql2/promise'

// const config = {
//   host: 'localhost',
//   user: 'root',
//   port: 3306,
//   password: '123456',
//   database: 'USUARIOS'

// }

// const connection = await mysql.createConnection(config)
// // console.log(connection)
// export class Usuario {
//   static async getAll () {
//     const [usuario] = await connection.query(
//       'SELECT nombre, contrasena, BIN_TO_UUID(id) id FROM usuario;'
//     )
//     // console.log(usuario)
//     return usuario
//   }

//   static async getById ({ nombre }) {
//     const [usuario] = await connection.query(
//       `SELECT * FROM usuario WHERE nombre = '${nombre}' LIMIT 1;`
//     )
//     // return usuario
//     return usuario
//   }

//   static async create ({ id, nombre, contrasena }) {
//     const res = await connection.query(
//       'INSERT INTO usuario (id, nombre, contrasena) VALUES (UUID_TO_BIN(?),?,?);',
//       [id, nombre, contrasena]
//     )
//     return res
//   }

//   static async insertInfoUser ({ edad, ingresos, rangoLaboral, usuarioId }) {
//     const res = await connection.query(
//       'INSERT INTO info_user (edad, ingresos, rango_laboral, usuario_id) VALUES (?,?,?,UUID_TO_BIN(?));',
//       [edad, ingresos, rangoLaboral, usuarioId]
//     )
//     return res
//   }

//   static async getCarros () {
//     const [usuario] = await connection.query(
//       'SELECT * FROM carros;'
//     )

//     return usuario
//   }
// }
