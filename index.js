const GITHUB_URL = 'https://api.github.com/search/repositories'

const Express = require('express')
const Apone = require('apone')
const Joi = require('joi')
const Boom = require('boom')
var rp = require('request-promise')

let app = Express()
let apone = new Apone(app)

const cache = {}
const CACHE_BUST = 86400000 // a day

const cacheQuery = (key, value, cacheObj) => {
  cacheObj[key] = {
    result: value,
    ttl: new Date().getTime()+CACHE_BUST
  }
}

const checkCache = (key, cacheObj) => {
  if (!cacheObj || !key) {
    return null
  }

  const cachedVal = cacheObj[key]
  if (cachedVal && cachedVal.ttl > Date.now()) {
    return cachedVal
  } else {
    return null
  }
}

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

    const { q, sort='stars', order='desc' } = req.params
    const headers = {
      'User-Agent': 'github_search'
    }
    const queryString = `q=${q}&sort=${sort}&order=${order}`

    const cacheHit = checkCache(queryString, cache)
    if (cacheHit) {
       res.send(cacheHit)
       console.info('cache hit')
       return next()
    }

    rp(`${GITHUB_URL}?${queryString}`, { headers })
      .then(resp => {
        res.send(resp)
        cacheQuery(queryString, resp, cache)
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
