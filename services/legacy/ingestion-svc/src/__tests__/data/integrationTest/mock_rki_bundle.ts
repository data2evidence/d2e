export const mock_rki_bundle = {
  resourceType: 'Bundle',
  type: 'transaction',
  entry: {
    resourceType: 'Bundle',
    type: 'batch',
    entry: [
      {
        resource: {
          resourceType: 'Patient',
          id: 'pat1',
          text: {
            status: 'generated',
            div: '<div xmlns="http://www.w3.org/1999/xhtml">\n      \n      <p>Patient Donald DUCK @ Acme Healthcare, Inc. MR = 654321</p>\n    \n    </div>'
          },
          identifier: [
            {
              use: 'usual',
              type: {
                coding: [
                  {
                    system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
                    code: 'MR'
                  }
                ]
              },
              system: 'http://acme.org/mrns',
              value: '12345'
            }
          ],
          active: true,
          name: [
            {
              use: 'official',
              family: 'Donald',
              given: ['Duck']
            }
          ],
          gender: 'male',
          photo: [
            {
              contentType: 'image/gif',
              data: 'R0lGODlhEwARAPcAAAAAAAAA/+9aAO+1AP/WAP/eAP/eCP/eEP/eGP/nAP/nCP/nEP/nIf/nKf/nUv/nWv/vAP/vCP/vEP/vGP/vIf/vKf/vMf/vOf/vWv/vY//va//vjP/3c//3lP/3nP//tf//vf///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH5BAEAAAEALAAAAAATABEAAAi+AAMIDDCgYMGBCBMSvMCQ4QCFCQcwDBGCA4cLDyEGECDxAoAQHjxwyKhQAMeGIUOSJJjRpIAGDS5wCDly4AALFlYOgHlBwwOSNydM0AmzwYGjBi8IHWoTgQYORg8QIGDAwAKhESI8HIDgwQaRDI1WXXAhK9MBBzZ8/XDxQoUFZC9IiCBh6wEHGz6IbNuwQoSpWxEgyLCXL8O/gAnylNlW6AUEBRIL7Og3KwQIiCXb9HsZQoIEUzUjNEiaNMKAAAA7'
            }
          ],
          contact: [
            {
              relationship: [
                {
                  coding: [
                    {
                      system: 'http://terminology.hl7.org/CodeSystem/v2-0131',
                      code: 'E'
                    }
                  ]
                }
              ],
              organization: {
                reference: 'Organization/1',
                display: 'Walt Disney Corporation'
              }
            }
          ],
          managingOrganization: {
            reference: 'Organization/1',
            display: 'ACME Healthcare, Inc'
          },
          link: [
            {
              other: {
                reference: 'Patient/pat2'
              },
              type: 'seealso'
            }
          ]
        },
        request: {
          method: 'POST',
          url: 'Patient',
          ifNoneExist: 'identifier=http://acme.org/mrns|12345'
        }
      },
      {
        resource: {
          resourceType: 'Observation',
          status: 'final',
          code: {
            coding: [
              {
                system: 'http://loinc.org',
                code: '789-8',
                display: 'Erythrocytes [#/volume] in Blood by Automated count'
              }
            ]
          },
          valueQuantity: {
            value: 4.12,
            unit: '10 trillion/L',
            system: 'http://unitsofmeasure.org',
            code: '10*12/L'
          }
        },
        request: {
          method: 'POST',
          url: 'Observation'
        }
      }
    ]
  }
}
