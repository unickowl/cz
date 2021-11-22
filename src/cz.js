import prompts from 'prompts'
import execa from 'execa'
import types from './types.json'
import chalk from 'chalk'

const typesList = types.map(type => ({
  title: type.name,
  description: `${type.emoji} ${type.description}`,
  value: type.value,
  emoji: type.emoji
}))

export const step_type = {
  type: 'autocomplete',
  name: 'commit_type',
  message: 'Pick a commit type.',
  choices: typesList,
  fallback: 'No matched type.'
}

export const step_message = {
  type: 'text',
  name: 'commit_message',
  message: prev => {
    const target = typesList.find(type => type.value === prev)
    return `${target.emoji} ${target.title}`
  },
  validate: value => {
    if (!value) {
      return 'Commit message is required.'
    }
    return true
  }
}

export const step_is_jira = {
  type: 'confirm',
  name: 'is_jira',
  message: 'Tag OWLPAY Jira issue ?',
  initial: false
}

export const step_jira_id = {
  type: prev => prev ? 'number' : null,
  name: 'jira_id',
  message: 'Jira issue id',
  onRender () {
    this.msg = chalk.bgBlueBright.white(' Jira issue ID ')
  },
  validate: value => {
    if (!value) {
      return 'Jira issue ID is required.'
    }
    return true
  }
}

export const createCommit = async () => {
  let isCanceled = false

  const response = await prompts([
    step_type,
    step_message,
    step_is_jira,
    step_jira_id
  ], {
    onSubmit: (prompt, answers) => {
      if (answers === undefined) {
        isCanceled = true
        return true
      }
    },
    onCancel: (prompt) => {
      isCanceled = true
      return false
    }
  })

  if (isCanceled) {
    console.log(chalk.magentaBright(' commit abort. '))
    return false
  }

  const { commit_type, commit_message, is_jira, jira_id } = response
  const type = typesList.find(type => type.value === commit_type)
  const msg = `${type.emoji} ${commit_type}: ${commit_message}`
  const result = is_jira
    ? `[OWLPAY-${jira_id}] ${msg}`
    : msg

  try {
    const commitResult = await execa('git', ['commit', '-m', result])
    const branchHashName = commitResult.stdout.match(/\[(.*)\]/).pop()
    const [branchName, branchHash] = branchHashName.split(' ')

    console.log(chalk.green(result))
    console.log(chalk.bold(branchName), chalk.bgCyanBright.black(` ${branchHash} `))

    return result
  } catch (error) {
    if (error.stdout) console.log(error.stdout)
    else if (error.stderr) console.log(error.stderr)
    else console.log(error)
  }
}

createCommit()
