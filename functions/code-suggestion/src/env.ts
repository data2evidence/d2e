const _env = Deno.env.toObject();

export const env = {
  COGNITO_CLIENT_ID: _env.COGNITO_CLIENT_ID,
  COGNITO_CLIENT_SECRET: _env.COGNITO_CLIENT_SECRET,
  COGNITO_TOKEN_ENDPOINT: _env.COGNITO_TOKEN_ENDPOINT,
  LAMBDA_API_ENDPOINT: _env.LAMBDA_API_ENDPOINT
};