import test from 'ava'
import { step_type } from '../src/cz'
import types from '../src/types.json'

test('pick type', async t => {
  const prompts = require('prompts')

  prompts.inject(types[10].value)
  const res = await prompts([step_type])

	t.is(res.commit_type, 'test')
})
