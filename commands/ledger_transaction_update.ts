import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { inject } from '@adonisjs/core'
import Ledger from '#models/ledger'
import Company from '#models/company'
import LedgerService from '#services/Ledger/ledger_service'
import QbDailySync from '#models/qb_daily_sync'
import type { ApplicationService } from '@adonisjs/core/types'
import User from '#models/user'
import { DateTime } from 'luxon'
import { LoggingService } from '#utils/logging_service'
import settings from '#config/settings'

type ParsedOutput = any
type UIPrimitives = any
type Kernel = any

@inject()
export default class LedgerTransactionUpdate extends BaseCommand {
  constructor(
    app: ApplicationService,
    kernel: Kernel,
    parsed: ParsedOutput,
    ui: UIPrimitives,
    prompt: Kernel['prompt'],
    private readonly ledgerService: LedgerService
  ) {
    super(app, kernel, parsed, ui, prompt)
  }
  private readonly vendorId: number = settings.vendor_id
  static commandName = 'ledger:transaction-update'
  static description = 'sync ledger transactions'

  static options: CommandOptions = { startApp: true }

  async run() {
    await this.ledgerTransactionUpdate()
  }

  private async ledgerTransactionUpdate() {
    const currentDate = DateTime.now().toISODate()

    const existingSyncs = await QbDailySync.query()
      .whereRaw('DATE("sync_date") = ?', [currentDate])
      .select('ledgerId')

    const syncedLedgerIds = existingSyncs.map((sync) => sync.ledgerId)

    const getLedgerTransactions = await Ledger.query()
      .where({
        // name: 'Bank Statement 834 Testing',
        status: 'active',
        vendorId: this.vendorId, // quickbook vendor id is 1
      })
      .whereNotIn('id', syncedLedgerIds)
      .limit(20)

    LoggingService.info('Hello to ledger transactions...', getLedgerTransactions)

    for (const ledgerDto of getLedgerTransactions) {
      let noOfTries = 0
      try {
        const company = await Company.query()
          .where({ id: Number(ledgerDto.companyId) })
          .first()

        LoggingService.info('This is the company..', company)
        if (!company) continue

        const user = await User.query().where({ id: company.ownerId }).first()
        await user?.loadCompany()
        if (!user) continue
        await user.loadCompany()

        LoggingService.info('This is the user...', user)

        //Here
        const syncLedger = await this.ledgerService.syncLedger(user, ledgerDto.slug)

        LoggingService.info('Syncing ledger...', syncLedger)

        noOfTries++
        await QbDailySync.create({
          ledgerId: ledgerDto.id,
          syncDate: DateTime.now(),
          retryCount: noOfTries,
          status: !syncLedger.success ? 'fail' : 'success',
        })
      } catch (e) {
        this.logger.error(`Failed to process customer ${ledgerDto.name}: ${e.message}`)
        LoggingService.error(e)
      }
    }
  }
}
