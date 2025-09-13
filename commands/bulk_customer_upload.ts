import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { inject } from '@adonisjs/core'
import VirtualAccountService from '#services/Customer/virtual_account_service'
import Customer from '#models/customer'
import settings from '#config/settings'
import type { ApplicationService } from '@adonisjs/core/types'
type ParsedOutput = any
type UIPrimitives = any
type Kernel = any

@inject()
export default class ProcessCustomer extends BaseCommand {
  constructor(
    app: ApplicationService,
    kernel: Kernel,
    parsed: ParsedOutput,
    ui: UIPrimitives,
    prompt: Kernel['prompt'],
    private readonly virtualAccountService: VirtualAccountService
  ) {
    super(app, kernel, parsed, ui, prompt)
  }
  private readonly preferredBank: string = settings.paystack.preferred_bank
  private readonly country: string = 'NG'

  static commandName = 'bulk:customer-upload'
  static description = 'Processes bulk customer upload data for virtual accounts'
  static options: CommandOptions = {
    startApp: true,
  }
  async run() {
    this.logger.info('Processing customer data...')
    await this.processCustomers()
  }

  private async processCustomers() {
    const unprocessedCustomers = await Customer.query()
      .where({
        status: 'pending',
        isBulkUploaded: true,
      })
      .limit(20)

    for (const customerDto of unprocessedCustomers) {
      try {
        await this.virtualAccountService.assignDedicatedVirtualAccount({
          email: customerDto.email,
          first_name: customerDto.firstName,
          last_name: customerDto.lastName,
          phone: customerDto.phoneNo ?? '',
          preferred_bank: this.preferredBank,
          country: this.country,
          account_number: customerDto.accountNumber ?? '',
          bvn: customerDto.bvn ?? '',
          bank_code: customerDto.bankCode ?? '',
        })

        this.logger.info(`Successfully processed bulk customer ${customerDto.email}.`)
      } catch (e) {
        this.logger.error(`Failed to process customer ${customerDto.email}: ${e.message}`)
      }
    }
  }
}
