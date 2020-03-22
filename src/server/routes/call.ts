import { config } from '../config'
import * as turn from '../turn'
import { Router } from 'express'
import { v4 } from 'uuid'

const router = Router()

const BASE_URL: string = config.baseUrl
const cfgIceServers = config.iceServers

router.post('/', (req, res) => {
  const callId = req.body.call ? encodeURIComponent(req.body.call) : v4()
  res.redirect(`${BASE_URL}/call/${callId}`)
})

router.get('/:callId', (req, res) => {
  const iceServers = turn.processServers(cfgIceServers)
  // MARKER : here we have all initial values (userId is set here > shall be 'windowId')
  res.render('call', {
    callId: encodeURIComponent(req.params.callId),
    userId: v4(),
    iceServers,
  });
});

export default router
