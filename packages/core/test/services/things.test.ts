import assert from 'assert'
import app from '../../src/app'

describe('\'things\' service', () => {
  it('registered the service', () => {
    const service = app.service('things')

    assert.ok(service, 'Registered the service')
  })
})
