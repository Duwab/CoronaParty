import { config } from './config'
import _debug from 'debug'
import express from 'express'
import handleSocket from './socket'
import path from 'path'
import { createServer } from './server'
import SocketIO from 'socket.io'
import call from './routes/call'
import index from './routes/index'

const debug = _debug('peercalls')

const BASE_URL: string = config.get('baseUrl')
const SOCKET_URL = `${BASE_URL}/ws`

debug(`WebSocket URL: ${SOCKET_URL}`)

const app = express()
const server = createServer(config, app)
const io = SocketIO(server, { path: SOCKET_URL })

app.locals.version = require('../../package.json').version
app.locals.baseUrl = BASE_URL

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, '../views'))

const router = express.Router()
router.use('/res', express.static(path.join(__dirname, '../res')))
router.use('/static', express.static(path.join(__dirname, '../../build')))
router.use('/call', call)
router.use('/', index)
app.use(BASE_URL, router)

io.on('connection', socket => handleSocket(socket, io))

export default server