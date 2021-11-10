import test from 'ava'
import { step_type, step_message } from '../src/cz'

test('commit message for test type', async t => {
  const prompts = require('prompts')
  const type = 'test'
  const message = 'input commit test'

  prompts.inject([type, message])
  const res = await prompts([step_type, step_message])

	t.is(res.commit_message, 'input commit test')
})
