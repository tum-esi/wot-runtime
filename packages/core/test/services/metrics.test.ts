import assert from 'assert'
import app from '../../src/app'

describe('\'metrics\' service', () => {
  it('registered the service', () => {
    const service = app.service('metrics')

    assert.ok(service, 'Registered the service')
  })
})
