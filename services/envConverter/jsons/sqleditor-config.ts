export default `[notebook]
  [[interpreters]]

 [[[db2]]]
  name = HANA
  interface=sqlalchemy
  options='{"url": "hana://TENANT_READ_USER:@alp-hn-gold-sg.southeastasia.cloudapp.azure.com:39013/ALPDEV"}'
  
 [[[postgresql]]]
  name = PostgreSql
  interface=sqlalchemy
  options='{"url": "postgresql+psycopg2://postgres:Toor1234@alp-minerva-postgres-1:5432/alp"}'
  `;
