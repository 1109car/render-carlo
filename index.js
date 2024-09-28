import express from 'express'
import jwt from 'jsonwebtoken'
import { SECRET_JWT_KEY } from './config.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { UserRepository } from './user-repository.js'

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: 'http://localhost:5173', // Especifica el origen permitido (el front-end)
  credentials: true // Permite enviar credenciales como cookies, cabeceras de autorización, etc.
}))

app.use((req, res, next) => {
  const token = req.cookies.access_token

  req.session = { user: null }

  try {
    const data = jwt.verify(token, SECRET_JWT_KEY)
    req.session.user = data
  } catch (error) {
    req.session.user = null
  }
  next()
})

app.get('/', (req, res) => {
  const { user } = req.session
  res.send({ user })
  // res.render('index', user)
  // const token = req.cookies.access_token
  // try {
  //   const data = jwt.verify(token, SECRET_JWT_KEY)
  //   res.render('idex', data)
  // } catch (error) {
  //   res.render('index')
  // }
})

// Ruta de prueba para generar un token (solo para fines de prueba)
app.post('/login', async (req, res) => {
  const { username, password } = req.body
  try {
    const user = await UserRepository.login({ username, password })

    const token = jwt.sign({ id: user.id, nombre: user.nombre }, SECRET_JWT_KEY, {
      expiresIn: '5h'
    })
    res
      .cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 5000 * 60 * 60
      })
      .send({ user, token })
  } catch (error) {
    res.status(401).send(error.message)
  }
})
app.post('/register', async (req, res) => {
  const { username, password } = req.body
  try {
    const id = await UserRepository.create({ username, password })
    res.send({ id })
  } catch (error) {
    console.log(error)
    res.status(400).send({ message: 'Credenciales incorrect' })
  }
})
app.post('/logout', (req, res) => {
  res
    .clearCookie('access_token')
    .json({ message: 'Loguot successful' })
})
// Ruta protegida
app.get('/protected', async (req, res) => {
  const { user } = req.session

  if (!user) return res.status(403).send('Access not authorized')
  // res.render('protected', user)
  // console.log(user)
  res.send({ user })

  // const token = req.cookies.access_token
  // if (!token) {
  //   return res.status(403).send('Access not authorized')
  // }
  // try {
  //   const data = jwt.verify(token, SECRET_JWT_KEY)
  //   res.remder('protected', data)
  // } catch (error) {
  //   res.status(401).send('Access not authorized')
  // }
})

app.post('/userInfoRegister', async (req, res) => {
  const { nombre, edad, ingresos, rangoLaboral } = req.body
  console.log(nombre)
  await UserRepository.InfoUser({
    nombre,
    edad,
    ingresos,
    rangoLaboral
  })
})
app.get('/userInfoRegister', async (req, res) => {
  const result = await UserRepository.getCarros()
  // if (result) return res.status(403).send('No encontrado')
  res.send(result)
})
const PORT = 3000
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`)
})
