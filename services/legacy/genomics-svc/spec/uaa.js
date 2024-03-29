let error = require(__base + 'error');
let http = require('http');
let https = require('https');
let url = require('url');

module.exports.getJWT = async function ( uaaOptions, user, password ) {
    return new Promise(
        (resolve, reject) => {
            const uaaURL = url.parse(`${uaaOptions.url}/oauth/token`);
            const payload = `grant_type=password&username=${encodeURIComponent(user.toUpperCase())}&password=${encodeURIComponent(password)}&response_type=code&token_format=jwt`;
            let request = (uaaURL.protocol === 'http:' ? http : https).request(
                {
                    method: 'POST',
                    protocol: uaaURL.protocol,
                    hostname: uaaURL.hostname,
                    port: uaaURL.port,
                    path: uaaURL.path,
                    auth: `${uaaOptions.clientid}:${uaaOptions.clientsecret}`,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Content-Length': payload.length
                    }
                },
                response => {
                    let body = '';
                    response
                        .on('data', chunk => body += chunk);
                    if (response.statusCode >= 200 && response.statusCode < 300) {
                        response.on('end',
                            () => {
                                try {
                                    resolve(body ? JSON.parse(body).access_token : null);
                                }
                                catch (exception) {
                                    reject(error.normalize(exception));
                                }
                            }
                        );
                    }
                    else {
                        response.on('end',
                            () => {
                                try {
                                    reject(new error.BioInfHTTPError(response.statusCode, body && body.errorCode ? body : `Logging into UAA service at ${uaaOptions.url} for user ${user} failed: ${response.statusMessage}`));
                                }
                                catch (exception) {
                                    reject(error.normalize(exception));
                                }
                            }
                        );
                    }
                }
            );
            request.on('error', exception => reject(error.normalize(exception)));
            request.end(payload);
        }
    );
}
