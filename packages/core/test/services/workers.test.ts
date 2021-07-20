import assert from 'assert'
import app from '../../src/app'

describe('\'workers\' service', () => {
  it('registered the service', () => {
    const service = app.service('workers')

    assert.ok(service, 'Registered the service')
  })
})
