import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class PollBankAccountTransaction extends BaseCommand {
  static commandName = 'poll:bank-account-transaction'
  static description = ''

  static options: CommandOptions = {}

  async run() {
    this.logger.info('Hello world from "PollBankAccountTransaction"')
  }
}
