import request from 'supertest'
import Server from '../src/server'

describe('GET /api', () => {
  it('should return 200 OK', () => {
    return request(Server).get('/api').expect(200)
  })
})
