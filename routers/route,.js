import { UsuariosController } from '../controllers/usuario'
import { Router } from 'express'

export const createMovieRouter = ({ movideModel }) => {
  const router = Router()

  const usuariosController = new UsuariosController({ movideModel })
  router.get('/', usuariosController.getAll)
}
