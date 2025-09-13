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
type ParsedOutput = any
type UIPrimitives = any
type Kernel = any

@inject()
export default class BankTransactionUpdate extends BaseCommand {
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
  static commandName = 'bank:transaction-update'
  static description = 'Sync bank account transactions'
  static options: CommandOptions = { startApp: true }

  async run() {
    await this.bankTransactionUpdate()
  }
  private async bankTransactionUpdate() {
    const currentDate = DateTime.now().toISODate()

    const existingSyncs = await MonoDailySync.query()
      .whereRaw('DATE("sync_date") = ?', [currentDate])
      .select('bankAccountId')

    const syncedBankAccountIds = existingSyncs.map((sync) => sync.bankAccountId)

    const getActiveBankTransaction = await BankAccount.query()
      .where({
        status: 'active',
        vendor: 'mono',
      })
      .whereNotIn('id', syncedBankAccountIds)
      .limit(20)

    for (const bankAccountDto of getActiveBankTransaction) {
      let noOfTries = 0
      try {
        const bankAccountTitle = await BankAccountTitle.query()
          .where({
            id: bankAccountDto.bankAccountTitleId,
          })
          .first()
        if (!bankAccountTitle) continue

        const company = await Company.query().where({ id: bankAccountTitle.companyId }).first()
        if (!company) continue

        const user = await User.query().where({ id: company.ownerId }).first()
        await user?.loadCompany()
        if (!user) continue

        const syncAccount = await this.bankAccountService.syncBankAccount(user, bankAccountDto.slug)
        noOfTries++
        await MonoDailySync.create({
          bankAccountId: bankAccountDto.id ?? undefined,
          syncDate: DateTime.now(),
          retryCount: noOfTries,
          status: !syncAccount.success ? 'fail' : 'success',
        })
      } catch (e) {
        this.logger.error(`Failed to process customer ${bankAccountDto.accountName}: ${e.message}`)
      }
    }
  }
}
