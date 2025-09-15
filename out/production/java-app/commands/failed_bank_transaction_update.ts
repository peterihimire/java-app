import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { inject } from '@adonisjs/core'
import BankAccount from '#models/bank_account'
import Company from '#models/company'
import BankAccountTitle from '#models/bank_account_title'
import BankAccountService from '#services/BankAccount/bank_account_service'
import MonoDailySync from '#models/mono_daily_sync'
import type { ApplicationService } from '@adonisjs/core/types'
import User from '#models/user'
import { DateTime } from 'luxon'
import { LoggingService } from '#utils/logging_service'

type ParsedOutput = any
type UIPrimitives = any
type Kernel = any

@inject()
export default class FailedBankTransactionUpdate extends BaseCommand {
  constructor(
    app: ApplicationService,
    kernel: Kernel,
    parsed: ParsedOutput,
    ui: UIPrimitives,
    prompt: Kernel['prompt'],
    private readonly bankAccountService: BankAccountService
  ) {
    super(app, kernel, parsed, ui, prompt)
  }
  static commandName = 'failed:bank-transaction-update'
  static description = 'Retry failed bank transactions'

  static options: CommandOptions = { startApp: true }

  async run() {
    await this.failedBankTransactionUpdate()
  }

  private async failedBankTransactionUpdate() {
    const currentDate = DateTime.now().toISODate()
    const failedSyncs = await MonoDailySync.query()
      .whereRaw('DATE("sync_date") = ?', [currentDate])
      .andWhere('status', 'fail')
      .orderBy('updated_at', 'asc')
      .limit(2)

    for (const monoDailyDto of failedSyncs) {
      try {
        await MonoDailySync.query().where('id', monoDailyDto.id).update({ retry_in_progress: true })

        const bankAccount = await BankAccount.query()
          .where({ id: monoDailyDto.bankAccountId })
          .first()
        if (!bankAccount) {
          continue
        }

        const bankAccountTitle = await BankAccountTitle.query()
          .where({ id: bankAccount.bankAccountTitleId })
          .first()
        if (!bankAccountTitle) {
          continue
        }

        const company = await Company.query().where({ id: bankAccountTitle.companyId }).first()
        if (!company) {
          continue
        }

        const user = await User.query().where({ id: company.ownerId }).first()
        await user?.loadCompany()
        if (!user) {
          continue
        }

        // Perform the sync
        const syncAccount = await this.bankAccountService.syncBankAccount(user, bankAccount.slug)

        LoggingService.anyInfo({ accountNumber: bankAccount.accountNumber, syncAccount })

        await MonoDailySync.query()
          .where('id', monoDailyDto.id)
          .update({
            retryCount: monoDailyDto.retryCount + 1,
            syncDate: DateTime.now(),
            status: syncAccount.success ? 'success' : 'fail',
            retry_in_progress: false,
          })
      } catch (e) {
        this.logger.error(`Failed to process customer ${monoDailyDto.bankAccountId}: ${e.message}`)
      }
    }
    LoggingService.anyInfo('All failed syncs have been processed.')
  }
}
