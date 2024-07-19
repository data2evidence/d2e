import { BotEvent, MedplumClient } from "@medplum/core";
import { AuditEvent, Organization, QuestionnaireResponse, Reference } from "@medplum/fhirtypes";

export async function createAuditEvent(medplum: MedplumClient, event: QuestionnaireResponse, log: string): Promise<void> {
    // let reference:Reference<Organization> = {
    //     reference: `Bot/${event.input.id}`,
    //     display: event.bot.display
    // }
    const auditEvent: AuditEvent = {
      resourceType: 'AuditEvent',
      meta: {
        project: event.meta.project
      },
      period: {
        start: new Date().toISOString(),
        end: new Date().toISOString(),
      },
      recorded: new Date().toISOString(),
      type: {
        code: 'execute',
      },
      agent: [
        {
          type: {
            text: 'bot',
          },
          requestor: false,
        },
      ],
      source:undefined,
    //   entity: createAuditEventEntities(bot, request.input, request.subscription, request.agent, request.device),
    outcome: "0",
    outcomeDesc: log
    //   extension: buildTracingExtension(),
    }
    await medplum.createResource<AuditEvent>(auditEvent)
}