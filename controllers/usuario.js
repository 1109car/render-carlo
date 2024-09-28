import { Usuario } from '../models/model'

export class UsuariosController {
  static async getAll (req, res) {
    const { genre } = req.query
    const movie = await Usuario.getAll({ genre })
    res.json(movie)
  }
}
