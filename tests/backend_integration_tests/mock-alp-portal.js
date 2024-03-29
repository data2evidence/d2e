const express = require("express")
const { ApolloServer, gql } = require('apollo-server-express');
const https = require("https");

var typeDefs = gql(`
    type Query {
        studies: [Study]
    }
    type Study {
        id: String
        schemaName: String,
        databaseName: String
}`);

async function startApolloServer() {

  const config = { ssl: true, port: 41001, hostname: 'localhost' };

  const server = new ApolloServer({ 
    typeDefs,
    mocks: true
  });
  await server.start();

  const app = express();
  server.applyMiddleware({ app });

  console.log("middleware applied");
  let httpServer;
  httpServer = https.createServer(
    {
      key: "-----BEGIN RSA PRIVATE KEY-----\nMIIEpQIBAAKCAQEAxhZOHx31Ku0PEkn7FXNtT1pw+vKhH7qWr491CQnErcljtmcGNb3t8v5+viwG5Y6PbcAVydh0JxKbTzPRoKhz5WIMMvsqC/o4vnDssam/6Zn6zrv4j9q7T1UWAkArCrvWfgDHdCx3TE/KtKz4v/OEDfdSLvKK6IixqdaooBEzMHGkk6bUhMif0Blme/L7cYCQ5fOZQDFI2/f6VFCrq6p0nMEwpD7XNqIuR125L1wJ5Dn7JXhnBd1//5E8phsmETSH1jQpeg52MjeypO/xw7wJF7mrJorFz5KgZ5jyHWfZITo7WvPhmYBRSb+JxEbVzLlEo8sfYs6L5DT4Glsumz3o2wIDAQABAoIBAQCiD8mmZ6oXjo9QFTrZF/CMhZ/9j9gGz29M/v9vf5Br5mIv7yYDffpZXaFwETErSnFKB2dMFk0hUnXCXNDasjbvqkH0y8xgtD0MgfMEf67FffbWgK8hcoDgrOouuTT9uSQJPrXv9Bk+U+Gx4/o3gRG/I2MXidPf30YLf9XB75CDxmRFwD6h4SVb+RMPxc+bto7l3dVxR6jDGMQQmYJtnKLpab9sVcdtvk6zzdFLch+AbQ+DjNKJ8pvOn3hSdC1EPPj4W0WX2yU9h5/Nz00jTCjS9UdrQm9Wby25JSUNzTmxHA8OIDwkIv2xhSilSfxYcOLAsSBI+fw/tqR3WH8GpqvhAoGBAPYJDF3fPAuxYwhpWLRlb95Y1ptPY0WcVzmYm/NptvNWjOXJQXjpT/k6iWr25Ife5lq5xNPPQvTso4PYNvY3+10f5e4bnRC3EciFNVzKx+l5+2xCvBd3csS0TxRlfXXPuS3I/EGJzUTADXr0QVvKcOrox5CZXkvXoDXvIzN+krzzAoGBAM4cHlzHGwGL6bx/vnFSrfUidOTjYhH6peJ7h2eZ5IeTjFvwMT/XyIllbDm0BkfOqlKVaPfRduNqa5e8gAwr3nlSrexJukKE0TBtNsWo/k1cOgwMWm2ixryAinRtIFBS4V+RHHu01cA/ixGA1npep3GRIeZhML5HfByPXUSiUX55AoGBAL/jqruEImbUQPMMhtybyLZX/3k+X6SpHPaU6fzc1I3RUS7e2quc/HzbhNXiHbdCx9K21KaGHii8b4OjHKrIWsn02PXun3+r6LjF/CqVFXopY0i6e8ypot976bl0tncuPbVR7jyHZ4tZZqog2uDmcU8lopBKrdrlH9Uw3/mHnJa1AoGAN+a6eXFrKrU29PA0x+mj0tvAlp/xZmzz9wSIChpcOEVViU4RHX66HkHK46+nEGzGF1X8vVIri6y+d84hcKupUICTOYYZpZb+YcMNWvjl2DeOatwi3p+KhW/bnY5HeGGyTMg/0HGQk+7oGhw2j8QCaDPz3Nc5cDJVQC3GHypjLgkCgYEAyZZwIxuO7c+9b4iJ81yh9GrffjGs5Ta0Y3usRKXUGyLfy8I4XqbCAMAabdTYaQGDUsakqcVWeSaoQbXuARhDhHdYlfmyaNr+Fb6ljTzswakaxqmXrAM6Z1c6TtLJaBEmXgwPviZtvS+GdARzU/u5Xe4ttrGAO5AiMPMv977giT4=\n-----END RSA PRIVATE KEY-----",
      cert: "-----BEGIN CERTIFICATE-----\nMIIEnjCCA4agAwIBAgIJANcIfWaNJ73aMA0GCSqGSIb3DQEBCwUAMIGXMQswCQYDVQQGEwJTRzESMBAGA1UECAwJU2luZ2Fwb3JlMRIwEAYDVQQHDAlTaW5nYXBvcmUxDDAKBgNVBAoMA0Q0TDEMMAoGA1UECwwDQUxQMRIwEAYDVQQDDAlsb2NhbGhvc3QxMDAuBgkqhkiG9w0BCQEWIXN3ZWVjaGluLmNodWFAZGF0YTRsaWZlLWFzaWEuY2FyZTAeFw0yMTAzMDIxNzE3MjhaFw0yMzA2MDUxNzE3MjhaMIGXMQswCQYDVQQGEwJTRzESMBAGA1UECAwJU2luZ2Fwb3JlMRIwEAYDVQQHDAlTaW5nYXBvcmUxDDAKBgNVBAoMA0Q0TDEMMAoGA1UECwwDQUxQMRIwEAYDVQQDDAlsb2NhbGhvc3QxMDAuBgkqhkiG9w0BCQEWIXN3ZWVjaGluLmNodWFAZGF0YTRsaWZlLWFzaWEuY2FyZTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMYWTh8d9SrtDxJJ+xVzbU9acPryoR+6lq+PdQkJxK3JY7ZnBjW97fL+fr4sBuWOj23AFcnYdCcSm08z0aCoc+ViDDL7Kgv6OL5w7LGpv+mZ+s67+I/au09VFgJAKwq71n4Ax3Qsd0xPyrSs+L/zhA33Ui7yiuiIsanWqKARMzBxpJOm1ITIn9AZZnvy+3GAkOXzmUAxSNv3+lRQq6uqdJzBMKQ+1zaiLkdduS9cCeQ5+yV4ZwXdf/+RPKYbJhE0h9Y0KXoOdjI3sqTv8cO8CRe5qyaKxc+SoGeY8h1n2SE6O1rz4ZmAUUm/icRG1cy5RKPLH2LOi+Q0+BpbLps96NsCAwEAAaOB6jCB5zCBtgYDVR0jBIGuMIGroYGdpIGaMIGXMQswCQYDVQQGEwJTRzESMBAGA1UECAwJU2luZ2Fwb3JlMRIwEAYDVQQHDAlTaW5nYXBvcmUxDDAKBgNVBAoMA0Q0TDEMMAoGA1UECwwDQUxQMRIwEAYDVQQDDAlsb2NhbGhvc3QxMDAuBgkqhkiG9w0BCQEWIXN3ZWVjaGluLmNodWFAZGF0YTRsaWZlLWFzaWEuY2FyZYIJAPBvlC5iaZfzMAkGA1UdEwQCMAAwCwYDVR0PBAQDAgTwMBQGA1UdEQQNMAuCCWxvY2FsaG9zdDANBgkqhkiG9w0BAQsFAAOCAQEAxrcUBKeB6+06VtR2eT6kk++gVmV7WUoMI4FYOt0V3YPCwC9LVR7FTx+ym58P46i8RS0UDjjHW77YC77a7fQHwfcCAxIGHlSpJjlm/v4ln8hO6WErSsmUpYpMQJy6KgmE8Uk4tM1kpnSUWNLHYi6dr//kPlzQg+safQNnu9zuyruTQ1YoLvQeHQ2Jl0Hz4DAQPVCrF8eIR4TxD4EL6Pz9zzODeCMc0ujlZDKld3xSZWvJANxaMw1oeyBka1QwuDZOEeoLEjlfkphOA+sjcOLiBGYwC134vr6GS+F5REr75a7KMJMgqG5nqhpryxoAtV8kICMQMNk4koTjy4w0/LLeJw==\n-----END CERTIFICATE-----"
    },
    app,
  );
  await new Promise(resolve => httpServer.listen({ port: config.port }, resolve));
  console.log(
    '🚀 Server ready at',
    `http${config.ssl ? 's' : ''}://${config.hostname}:${config.port}${server.graphqlPath}`
  );
  return { server, app };
}

startApolloServer();