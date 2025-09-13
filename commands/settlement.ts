import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import Settlement from '#models/settlement'
import SettlementService from '#services/Settlement/settlement_service'
import { inject } from '@adonisjs/core'

export default class SettlementCommand extends BaseCommand {
  static commandName = 't2-settlement'
  static description = 'This command is used to pay all unpaid T2 settlements'

  static options: CommandOptions = {
    startApp: true,
  }

  @inject()
  async run(settlementService: SettlementService) {
    this.logger.info('Settlement Command Started')
    const unpaidSettlements = await Settlement.getUnpaidT2SettlementsForPayment()
    console.log(unpaidSettlements)
    for (const unpaidSettlement of unpaidSettlements) {
      try {
        const settlement = await Settlement.query()
          .preload('company')
          .where('id', unpaidSettlement.id)
          .first()
        await settlementService.paySettlement(settlement!)
        this.logger.info(`Settlement ${settlement!.id} on the way to payment`)
      } catch (e) {
        this.logger.error(e)
      }
    }
    this.logger.info('Settlement Command Ended')
  }
}
