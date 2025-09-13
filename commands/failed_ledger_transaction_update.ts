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
type ParsedOutput = any
type UIPrimitives = any
type Kernel = any

@inject()
export default class FailedLedgerTransactionUpdate extends BaseCommand {
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
  static commandName = 'failed:ledger-transaction-update'
  static description = 'Retry failed bank transactions'

  static options: CommandOptions = { startApp: true }

  async run() {
    this.logger.info('Hello world from "FailedLedgerTransactionUpdate"')
    await this.failedLedgerTransactionUpdate()
  }

  private async failedLedgerTransactionUpdate() {
    const currentDate = DateTime.now().toISODate()
    const failedSyncs = await QbDailySync.query()
      .whereRaw('DATE("sync_date") = ?', [currentDate])
      .andWhere('status', 'fail')
      .orderBy('updated_at', 'asc')
      .limit(20)

    LoggingService.info('These are failed syncs...', failedSyncs)
    for (const qbDailyDto of failedSyncs) {
      try {
        await QbDailySync.query().where('id', qbDailyDto.id).update({ retry_in_progress: true })

        const ledger = await Ledger.query().where({ id: qbDailyDto.ledgerId }).first()
        if (!ledger) {
          continue
        }
        const company = await Company.query().where({ id: ledger.companyId }).first()
        if (!company) {
          continue
        }
        const user = await User.query().where({ id: company.ownerId }).first()
        await user?.loadCompany()
        if (!user) {
          continue
        }

        // Perform the sync
        const syncLedger = await this.ledgerService.syncLedger(user, ledger.slug)
        LoggingService.info('Sync result for ledger', ledger.slug, syncLedger)

        await QbDailySync.query()
          .where('id', qbDailyDto.id)
          .update({
            retryCount: qbDailyDto.retryCount + 1,
            syncDate: DateTime.now(),
            status: syncLedger.success ? 'success' : 'fail',
            retry_in_progress: false,
          })
      } catch (e) {
        this.logger.error(`Failed to process customer ${qbDailyDto.ledgerId}: ${e.message}`)
      }
    }
  }
}
