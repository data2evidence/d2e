export const mock_rki = {
  patientUUID: '6274cce2-fcf9-40cf-8a41-7b0a7a63c12d',
  data: {
    resourceType: 'QuestionnaireResponse',
    language: 'en',
    questionnaire: {
      reference: 'http://fhir.data4life.care/stu3/Registry/Questionnaire/Q1_personal_info|1.1.0'
    },
    extension: [
      {
        url: 'http://fhir.data4life.care/stu3/StructureDefinition/survey-id',
        valueId: 'a8637dac-ea27-496b-9bfa-36b683890fda'
      }
    ],
    authored: '2021-10-11T00:00:00.000+02:00',
    status: 'completed',
    item: [
      {
        linkId: 'what_age',
        text: 'How old are you?',
        answer: [
          {
            valueCoding: {
              system: 'http://fhir.data4life.care/stu3/CodeSystem/Registry',
              code: '30s',
              display: '30-39'
            }
          }
        ]
      },
      {
        linkId: 'what_gender',
        text: 'Gender: How do you identify?',
        answer: [
          {
            valueCoding: {
              system: 'http://fhir.data4life.care/stu3/CodeSystem/Registry',
              code: 'Female',
              display: 'Female'
            }
          }
        ]
      },
      {
        linkId: 'which_country_residence',
        text: 'In which country do you live?',
        answer: [
          {
            valueCoding: {
              system: 'urn:iso:std:iso:3166',
              code: 'AL',
              display: 'Albania'
            }
          }
        ]
      },
      {
        linkId: 'what_postal_code',
        text: 'What are the first 3 digits of your postal code?',
        answer: [
          {
            valueString: '123'
          }
        ]
      },
      {
        linkId: 'what_research_topic',
        text: 'Which research topics are relevant to you personally?',
        answer: [
          {
            valueCoding: {
              system: 'http://fhir.data4life.care/stu3/CodeSystem/Registry',
              code: 'topic_autoimmune',
              display: 'Autoimmune diseases (for example, thyroid, rheumatism)'
            }
          },
          {
            valueCoding: {
              system: 'http://fhir.data4life.care/stu3/CodeSystem/Registry',
              code: 'topic_work',
              display: 'Work (for example, health consequences of working from home)'
            }
          }
        ]
      }
    ]
  }
}
