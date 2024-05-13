let LOGTO__ADMIN_SERVER__FQDN_URL = "http://alp-logto-1:3002";
let LOGTO__CLIENTID_PASSWORD__BASIC_AUTH =
  "YTU2MG84dHF3NzloeTJjcG44eDFxOnhrOEhQNFZEenFKY25YQ1RwZGFRTTZVdDJTd3JHMzd1";

// TODO: remove any type
function encodeData(data: any) {
  var formBody = [];
  for (var property in data) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(data[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  return formBody.join("&");
}

export async function fetchToken() {
  let r = await fetch(`${LOGTO__ADMIN_SERVER__FQDN_URL}/oidc/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${LOGTO__CLIENTID_PASSWORD__BASIC_AUTH}`,
    },
    body: encodeData({
      grant_type: "client_credentials",
      resource: "https://default.logto.app/api",
      scope: "all",
    }),
  });
  let jwt = await r.json();
  console.log(jwt);
  return jwt;
}

export async function post(
  path: string,
  headers: any,
  data: object
): Promise<Response> {
  const resp = await fetch(`${LOGTO__ADMIN_SERVER__FQDN_URL}/api/${path}`, {
    method: "POST",
    headers: Object.assign({}, headers, {
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(data),
  });
  return resp;
}

export async function patch(
  path: string,
  headers: any,
  data: object
): Promise<Response> {
  const resp = await fetch(`${LOGTO__ADMIN_SERVER__FQDN_URL}/api/${path}`, {
    method: "PATCH",
    headers: Object.assign({}, headers, {
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(data),
  });
  return resp;
}
