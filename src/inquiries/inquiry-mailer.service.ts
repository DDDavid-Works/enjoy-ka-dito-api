import { Injectable, Logger } from '@nestjs/common'
import { Inquiry } from './inquiry.entity.js'

const FIELDS: [keyof Inquiry, string][] = [
  ['name', 'Name'],
  ['email', 'Email'],
  ['phone', 'Phone'],
  ['companyName', 'Company'],
  ['designation', 'Designation'],
  ['travelerType', 'Traveler type'],
  ['destination', 'Destination'],
  ['desiredDestinations', 'Desired destinations'],
  ['travelerCount', 'Travelers'],
  ['travelDates', 'Travel dates'],
  ['tripDuration', 'Trip duration'],
  ['budgetBracket', 'Budget'],
  ['countryOfResidence', 'Country of residence'],
  ['groupType', 'Group type'],
  ['travelingWithSeniorsOrChildren', 'Seniors or children'],
  ['flightsBooked', 'Flights booked'],
  ['message', 'Message'],
]

const escapeHtml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// Emails the team when an inquiry comes in, through Resend. Off unless RESEND_API_KEY and INQUIRY_NOTIFY_TO are set.
@Injectable()
export class InquiryMailerService {
  private readonly logger = new Logger(InquiryMailerService.name)

  async notify(inquiry: Inquiry) {
    const apiKey = process.env.RESEND_API_KEY
    const to = process.env.INQUIRY_NOTIFY_TO?.split(',').map((address) => address.trim()).filter(Boolean)
    if (!apiKey || !to?.length) return

    const rows = FIELDS.map(([key, label]) => [label, inquiry[key]] as const)
      .filter(([, value]) => typeof value === 'string' && value.trim() !== '')
      .map(([label, value]) => `<tr><td style="padding:4px 12px 4px 0;color:#666;vertical-align:top">${label}</td><td style="padding:4px 0">${escapeHtml(String(value)).replace(/\n/g, '<br>')}</td></tr>`)
      .join('')

    const kind = inquiry.type === 'general' ? 'message' : 'quote request'

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: process.env.INQUIRY_EMAIL_FROM ?? 'Enjoy Ka Dito <onboarding@resend.dev>',
          to,
          reply_to: inquiry.email,
          subject: `New ${kind} from ${inquiry.name}`,
          html: `<p>A new ${kind} was submitted on the website.</p><table style="font-family:sans-serif;font-size:14px">${rows}</table>`,
        }),
      })
      if (!response.ok) this.logger.error(`Resend rejected the notification (HTTP ${response.status}): ${await response.text()}`)
    } catch (err) {
      this.logger.error(`Inquiry notification failed: ${err}`)
    }
  }
}
