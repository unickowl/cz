import test from 'ava'
import { step_type, step_message, step_is_jira, step_jira_id } from '../src/cz'

test('jira id', async t => {
  const prompts = require('prompts')
  const type = 'test'
  const message = 'input commit test'
  const isJira = true
  const issueId = 13845

  prompts.inject([type, message, isJira, issueId])
  const res = await prompts([step_type, step_message, step_is_jira, step_jira_id])

  t.is(res.jira_id, 13845)
})