const GITHUB_URL = 'https://api.github.com/search/repositories'

const Express = require('express')
const Apone = require('apone')
const Joi = require('joi')
const Boom = require('boom')
const cors = require('cors')
const bodyParser = require('body-parser')
const rp = require('request-promise')
const queryString = require('queryString')
const cache = require('memory-cache')

const CACHE_BUST = 86400000 // a day

const cacheMiddleware = (durationMs) => {
  return (req, res, next) => {
    const key = req.originalUrl || req.url
    const cachedVal = cache.get(key)
    if (cachedVal) {
      console.info('cache hit')
      res.send(cachedVal)
    } else {
      res.sendResponse = res.send
      res.send = (body) => {
        cache.put(key, body, durationMs)
        res.sendResponse(body)
      }
      next()
    }
  }
}

let app = Express()
app.use(cors())
app.use(bodyParser.json())
app.use(cacheMiddleware(CACHE_BUST))
let apone = new Apone(app)

apone.register({
  path: '/repos',
  method: 'get',
  validation: {
    params: Joi.object().keys({
      q: Joi.string(),
      sort: Joi.string().valid(['stars', 'forks', 'updated']),
      order: Joi.string().valid(['desc', 'asc'])
    })
  },
  handle: (req, res, next) => {

    const { q, sort, order='desc' } = req.query
    const headers = {
      'User-Agent': 'github_search'
    }

    const qs = `q=${q}&sort=${sort}&order=${order}`

    rp(`${GITHUB_URL}?${qs}`, { headers })
      .then(resp => {
        res.send(resp)
        return next()
      })
      .catch(next)
  }
})

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }
  res.status(500).send(new Boom(err).output)
})

app.listen(3000, console.log('listening on port 3000'))
