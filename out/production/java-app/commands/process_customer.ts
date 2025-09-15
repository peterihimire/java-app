import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { inject } from '@adonisjs/core'
import VirtualAccountService from '#services/Customer/virtual_account_service'
import Customer from '#models/customer'
import CustomerNuban from '#models/customer_nuban'
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

  static commandName = 'process:customer'
  static description = 'Processes customer data for virtual accounts'
  static options: CommandOptions = {
    startApp: true,
  }
  async run() {
    this.logger.info('Processing customer data...')
    await this.processCustomers()
  }

  private async processCustomers() {
    const unprocessedCustomers = await Customer.query().where({ status: 'pending' }).limit(5)

    for (const customerDto of unprocessedCustomers) {
      try {
        const createVendorCustomerResponse = await this.virtualAccountService.addVendorCustomer({
          email: customerDto.email,
          first_name: customerDto.firstName,
          last_name: customerDto.lastName,
          phone: customerDto.phoneNo,
        })

        await customerDto
          .merge({
            vendorCustomerCode: createVendorCustomerResponse?.data?.customer_code,
            vendorIntegrationNum: createVendorCustomerResponse?.data?.integration,
          })
          .save()

        console.log('hello to preferred bank process...', this.preferredBank)
        const createVendorVirtualAccountResponse =
          await this.virtualAccountService.addDedicatedVirtualAccount({
            customer: createVendorCustomerResponse.data.id,
            preferred_bank: this.preferredBank,
          })

        let customerNuban = await CustomerNuban.query()
          .where({ customerId: customerDto.id })
          .first()

        if (!customerNuban) {
          customerNuban = new CustomerNuban()
          customerNuban.customerId = customerDto.id
          customerNuban.accountName = 'processing'
          customerNuban.accountNumber = 'processing'
          customerNuban.bankName = 'processing'
          customerNuban.currency = 'processing'
          customerNuban.status = 'inactive'
          customerNuban.companyId = customerDto.companyId
        }

        await customerNuban
          .merge({
            customerId: customerDto.id,
            accountName: createVendorVirtualAccountResponse.data.account_name,
            accountNumber: createVendorVirtualAccountResponse.data.account_number,
            bankName: createVendorVirtualAccountResponse.data.bank.name,
            currency: createVendorVirtualAccountResponse.data.currency,
            status: createVendorVirtualAccountResponse.data.active === true ? 'active' : 'inactive',
            companyId: customerDto.companyId,
          })
          .save()

        await customerDto
          .merge({
            status: createVendorVirtualAccountResponse.data.account_number ? 'active' : 'pending',
          })
          .save()

        if (
          createVendorVirtualAccountResponse.data.account_number &&
          customerDto.status === 'pending'
        ) {
          await customerDto
            .merge({
              status: 'active',
            })
            .save()
        }
        this.logger.info(`Successfully processed customer ${customerDto.email}.`)
      } catch (e) {
        this.logger.error(`Failed to process customer ${customerDto.email}: ${e.message}`)
      }
    }
  }
}
