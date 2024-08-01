# Get drivers from 1password
# OP_SERVICE_ACCOUNT_TOKEN=secrets.OP_SERVICE_ACCOUNT_TOKEN
:'
yarn --cwd internal get:drivers

# create .env.local for docker-compose in system services
# github actions uses the 1password action to handle these
OP_VAULT_NAME=Singapore ENV_NAME="base-all" OVERWRITE=true ./internal/scripts/get-op.sh
OP_VAULT_NAME=Singapore ENV_NAME="base-local" OVERWRITE=true ./internal/scripts/get-op.sh
OP_VAULT_NAME=Singapore ENV_NAME="local" OVERWRITE=true ./internal/scripts/get-op.sh
wc -l .env.base-all.yml .env.base-local.yml .env.local.yml
OP_VAULT_NAME=Singapore OVERWRITE=true yarn --cwd internal gen:env
sed -i "s/${HANASERVER_REPLACE}/${HANASERVER}/g" .env.local
sed -i "s/CDMDEFAULT/${TESTSCHEMA}/g" .env.local
sed -i "s/HTTPTEST_ADMIN_USER/${HDIUSER}/g" .env.local
sed -i "s/HTTPTEST_ADMIN_PWD/${HDIPW}/g" .env.local
cat .env.local
# cd ..
# Setup Test DB
yarn --prefer-offline
yarn inittestdb
exit 0
'
# Build system services
yarn build:minerva-test alp-caddy alp-minerva-postgres alp-minerva-gateway alp-minerva-analytics-svc alp-minerva-user-mgmt alp-minerva-portal-server alp-query-gen alp-bookmark alp-minerva-pg-mgmt-init alp-db-credentials-mgr alp-minerva-pa-config-svc alp-minerva-cdw-svc alp-minerva-s3 alp-minio-post-init

# Manipulate configuration
yq -i '.networks.alp.external=true' docker-compose.yml
yq -i '.services.alp-minerva-portal-server.environment.APP__DEPLOY_MODE="standalone"' docker-compose.yml
yq -i '.services.alp-minerva-gateway.environment.APP__DEPLOY_MODE="standalone"' docker-compose.yml
yq -i '.services.alp-caddy.environment.CS_PUBLIC_FQDN="localhost:41000"' docker-compose.yml
yq -i '.services.alp-caddy.ports |= ["41100:41100", "41000:41000"]' docker-compose.yml

# TODO: Add. create network for external to use
docker network create alp

# Get logto values
log_output=$(yarn init:logto)
echo "$log_output" | grep "LOGTO__" | awk -F'|' '{print $2}' | awk '{$1=$1};1' | while IFS='=' read -r key value; do
    export "$key=$value"            # Make available to bash script
    echo "$key=$value" >>.env.local # Make available to docker-compose
done
echo "USE_DUCKDB=false" >>.env.local

# *** Start postgres for seeding ***
yarn start:minerva-test alp-minerva-postgres alp-minerva-pg-mgmt-init -d --force-recreate

echo . create read role
docker exec -it alp-minerva-postgres-1 psql -h localhost -U postgres -p 5432 -d alp -c "INSERT INTO db_credentials_mgr.db (id,host,port,name,dialect,created_by,created_date,modified_by,modified_date,code) VALUES
	 ('9addef8a-56d1-42c2-bcad-3c10035d540a','${HANASERVER}',${HDIPORT},'ALPDEV','hana','local','2024-05-20 02:02:08.102165','local','2024-05-20 02:02:08.102165','${TESTSCHEMA}') ON CONFLICT DO NOTHING"

docker exec -it alp-minerva-postgres-1 psql -h localhost -U postgres -p 5432 -d alp -c "INSERT INTO db_credentials_mgr.db_credential (username,\"password\",salt,service_scope,db_id,created_by,created_date,modified_by,modified_date,user_scope) VALUES
	 ('TENANT_ADMIN_USER','jFmhIY46Jnq036IUp/DwKmY+Kmp2S49YjLALgWSzYdLJxulQZrsVEbcOgGfHUGw9n4/Zlq992IgIkRp3tnK+bQVnO6KhOoleMaQKu+hmb19PCDlT9DRTsqRaiDxfGbaCU9M7LGIIcioyE+gRg/36cBbG3ubd1gXufwYuvJRpIcdpnKGySTt+IdafyUqK0j+35N69K/K+DB/ARP5r92BaTnG+BKkHNj4TmkDQNTvvs496wP1ZEZzE4VA7ZM6M+ryRBjYC5QjMZcwkc17B9qnZxXNU4m/GpCqCX2UJ5nItR6+xPmXQhkrzhQ8p1dgcQMIXxIru9KXRYSmMySrOVzKzOVDFknzKJLT4yAcp9PQ4LOl+5beXc+YwgvNpnd988q7bbMQ6NVfiFiG3YZhYIRELlxjzqe+PiYJdoh2kHQzniNm5lwb6y0PGspI67BYoLB1gLm7xY73WdAyqHzSOKJMAmTzEdhkLzwCGqgT5NFVvNGKfa3EMuudz4SAoVf3NE027P007bkTaV8FjkzSDm2OrBCeGEA1ISN/VGTMw23wtVoIqn+xJQCHzwM2m7pZjvY55yyvIz3IQ2eujNSJU1t0CWwt14zrMgO2oKuRRqBUELgarU0B53V6rWBUQPDR2BvbGP6bv37ajgJck1Xy8BDLzsXT5mAr27yHQBcepDQlDEb4=','6VYQzEXOGtOhVo6SNyS21A==','Internal','9addef8a-56d1-42c2-bcad-3c10035d540a','local','2024-05-20 02:02:08.102165','local','2024-05-20 02:02:08.102165','Admin'),
	 ('TENANT_READ_USER','WzwifVMhR8lsZAPugommJ3S/tLcNL+atz87WMDVo4biJwYLlW6trgNli98VNpRnpdnfhku7ul4sULgbypoWUeskyyzn0S9svmQfAzKfPH92vXeM2jUGWhG+HD8E8GMs8GCoUKkupqnMCRtLyDqbuqDZo1D5xVppsICeUmJtm2GpL42p37FrW/ECnQT1pBRSYy83z0DU+9mZKB7gIUgLP+WYH27Q6ZpdIvXZVg0rjmFMSkdev9qUzwY04tjCoNZ0Eu+g/6IwB756eA4ZzX9OQMcTugz7hbavJwDO9dHJ0JjF+EfUvDSRSLOSgJ2z/dU5glsS4IJ9GS0Mow9aoc+BbXbUFwu0k7OMhimIqSVqS4asiGCfenhiQL+Z4OooBI0TYLoWWqQmgK92nGBrt9tZX50e+aKObMCc+tusT5ZIk+5V5b54VAribl5N+ysMp/F/c2k3BY7TvzSrdxo1wrzWaWLh0EGXONPw/FquYjpCXubLDMNdCSdQbO7wkz84hu+AAyJA7wooRxoNFTJ4rv0J6YsMJJtLQrhc+fSv3k9by1bqxxP2HpRwzVEkrrgwMu7cgo2yBIYpzYqoeXSg81FLkDJ8U43aDSM613iDxEwbEiTCcRtlbetKQuCYllq0rnU3go8qOVizr9Z5jOmx6MAD7XsnXIZmMzdP8GsKUev6cmss=','zvWc3eywv/cB41UUhWJAgg==','Internal','9addef8a-56d1-42c2-bcad-3c10035d540a','local','2024-05-20 02:02:08.102165','local','2024-05-20 02:02:08.102165','Read') ON CONFLICT DO NOTHING"

docker exec -it alp-minerva-postgres-1 psql -h localhost -U postgres -p 5432 -d alp -c "INSERT INTO db_credentials_mgr.db_extra (service_scope,db_id,created_by,created_date,modified_by,modified_date,value) VALUES
	 ('Internal','9addef8a-56d1-42c2-bcad-3c10035d540a','local','2024-05-20 02:02:08.102165','local','2024-05-20 02:02:08.102165','{\"ca\": \"-----BEGIN CERTIFICATE-----MIIDuTCCAqGgAwIBAgIUX/oNqJTx15vT2SI6fg9bEInu3mAwDQYJKoZIhvcNAQELBQAwIDEMMAoGA1UEChMDU1JFMRAwDgYDVQQDEwdjYS1yb290MB4XDTIwMDkwODEzMzExOFoXDTMwMDkwNjEzMzE0N1owIDEMMAoGA1UEChMDU1JFMRAwDgYDVQQDEwdjYS1yb290MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArf7hNfOgoFzY/Cfk8XrRIq4eG6rsf7o8DZKMCoLnwR+uFtzCXyY8HWsD33Po6azXIaTqhT7JFO9osbK8JhzcgiIhxDLT5y5jx77AwKjqPWezgwuKutNAw2E8U5In+1i4mDwP1jJg2pXSoxUzKYQub03Zt04VzXhUD9HT8E8oON9TgQOFMP2+14zQ8VM1OtDLImOedSmyAtk34Tytu38ra1VRIWAkwz7G2O3O5Lsn2NvljLpSasR1Y3JALN1ePeegDr05mQXnNkRkYa4AutMhbfg+P1elCuJEVKfp+80IMnmJXXHwXXbPg6VqYzZkYZRbob2ESynjy7qUL6W/MJg6JwIDAQABo4HqMIHnMA4GA1UdDwEB/wQEAwIBBjAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBSFTCgp1EHdFv14efJlS7Pl7xcZjzAfBgNVHSMEGDAWgBSFTCgp1EHdFv14efJlS7Pl7xcZjzA8BggrBgEFBQcBAQQwMC4wLAYIKwYBBQUHMAKGIGh0dHBzOi8vdmF1bHQuaHBzZ2MuZGUvdjEvcGtpL2NhMBIGA1UdEQQLMAmCB2NhLXJvb3QwMgYDVR0fBCswKTAnoCWgI4YhaHR0cHM6Ly92YXVsdC5ocHNnYy5kZS92MS9wa2kvY3JsMA0GCSqGSIb3DQEBCwUAA4IBAQBMhvDhtbWPc8O65zV3I76ecpvIPUY6Rc8aHRRdNzUUu6EgyGnK/KHJ0v3+k5yxP2axbDzcviHcvU/zf64FHoM7j+ObcsfwrmtbD9ZyJUcE2vRyH8yFppnHHIQP1nmVjXzAxWLysnko5D3myLcK5CJzUaTCnAld2R6cj774MyekCytbN4U3VvMKfGBJ544tfMgAPPBGAfPEB6qDBw0S5cLD1tIrsikrx8FReQHU9r+yJl4uRjz4SY/397i9QdzQGlZPpWaw/3GCnBwJiEDCwZnSK14v62LwJVH97JvX4/a5YS+GQpIEwD6cC5Ru1dbCMYTYZAcEcPDJk0ldRnahn/5u-----END CERTIFICATE-----\", \"schema\": \"${TESTSCHEMA}\", \"useTLS\": false, \"encrypt\": true, \"pooling\": true, \"cdwSchema\": \"${TESTSCHEMA}\", \"autoCommit\": false, \"probeSchema\": \"${TESTSCHEMA}\", \"vocabSchema\": \"CDMVOCAB\", \"configSchema\": \"MRI\", \"sslTrustStore\": \"-----BEGIN CERTIFICATE-----MIIDuTCCAqGgAwIBAgIUX/oNqJTx15vT2SI6fg9bEInu3mAwDQYJKoZIhvcNAQELBQAwIDEMMAoGA1UEChMDU1JFMRAwDgYDVQQDEwdjYS1yb290MB4XDTIwMDkwODEzMzExOFoXDTMwMDkwNjEzMzE0N1owIDEMMAoGA1UEChMDU1JFMRAwDgYDVQQDEwdjYS1yb290MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArf7hNfOgoFzY/Cfk8XrRIq4eG6rsf7o8DZKMCoLnwR+uFtzCXyY8HWsD33Po6azXIaTqhT7JFO9osbK8JhzcgiIhxDLT5y5jx77AwKjqPWezgwuKutNAw2E8U5In+1i4mDwP1jJg2pXSoxUzKYQub03Zt04VzXhUD9HT8E8oON9TgQOFMP2+14zQ8VM1OtDLImOedSmyAtk34Tytu38ra1VRIWAkwz7G2O3O5Lsn2NvljLpSasR1Y3JALN1ePeegDr05mQXnNkRkYa4AutMhbfg+P1elCuJEVKfp+80IMnmJXXHwXXbPg6VqYzZkYZRbob2ESynjy7qUL6W/MJg6JwIDAQABo4HqMIHnMA4GA1UdDwEB/wQEAwIBBjAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBSFTCgp1EHdFv14efJlS7Pl7xcZjzAfBgNVHSMEGDAWgBSFTCgp1EHdFv14efJlS7Pl7xcZjzA8BggrBgEFBQcBAQQwMC4wLAYIKwYBBQUHMAKGIGh0dHBzOi8vdmF1bHQuaHBzZ2MuZGUvdjEvcGtpL2NhMBIGA1UdEQQLMAmCB2NhLXJvb3QwMgYDVR0fBCswKTAnoCWgI4YhaHR0cHM6Ly92YXVsdC5ocHNnYy5kZS92MS9wa2kvY3JsMA0GCSqGSIb3DQEBCwUAA4IBAQBMhvDhtbWPc8O65zV3I76ecpvIPUY6Rc8aHRRdNzUUu6EgyGnK/KHJ0v3+k5yxP2axbDzcviHcvU/zf64FHoM7j+ObcsfwrmtbD9ZyJUcE2vRyH8yFppnHHIQP1nmVjXzAxWLysnko5D3myLcK5CJzUaTCnAld2R6cj774MyekCytbN4U3VvMKfGBJ544tfMgAPPBGAfPEB6qDBw0S5cLD1tIrsikrx8FReQHU9r+yJl4uRjz4SY/397i9QdzQGlZPpWaw/3GCnBwJiEDCwZnSK14v62LwJVH97JvX4/a5YS+GQpIEwD6cC5Ru1dbCMYTYZAcEcPDJk0ldRnahn/5u-----END CERTIFICATE-----\", \"sslCryptoProvider\": \"sapcrypto\", \"rejectUnauthorized\": false, \"enableAuditPolicies\": false, \"validateCertificate\": true, \"hostnameInCertificate\": \"alp-hn-gold-sg.southeastasia.cloudapp.azure.com\"}') ON CONFLICT DO NOTHING"

docker exec -it alp-minerva-postgres-1 psql -h localhost -U postgres -p 5432 -d alp -c "INSERT INTO db_credentials_mgr.db_vocab_schema (name,db_id,created_by,created_date,modified_by,modified_date) VALUES
	 ('CDMVOCAB','9addef8a-56d1-42c2-bcad-3c10035d540a','local','2024-05-20 02:02:08.102165','local','2024-05-20 02:02:08.102165') ON CONFLICT DO NOTHING"

# *** End postgres for seeding ***

# Start system services
yarn start:minerva-test alp-caddy alp-minerva-postgres alp-minerva-gateway alp-minerva-user-mgmt alp-minerva-portal-server alp-query-gen alp-bookmark alp-minerva-pg-mgmt-init alp-db-credentials-mgr alp-minerva-analytics-svc alp-minerva-pa-config-svc alp-minerva-cdw-svc alp-minerva-s3 alp-minio-post-init -d --force-recreate
sleep 120

### START OF LOG IN TO GET BEARER TOKEN
# Get sign in page
response=$(curl -ik "https://localhost:41100/oidc/auth?redirect_uri=https%3A%2F%2Flocalhost%3A41100%2Fportal%2Flogin-callback&client_id=$LOGTO__ALP_APP__CLIENT_ID&response_type=code&state=lbFDB1hcko&scope=openid%20offline_access%20profile%20email&nonce=Osptnuwqc47w&code_challenge=n6eqz8p8jj1L9Qu7pY2_GrWO7XyaQbWrcs54x9OAnPg&code_challenge_method=S256")

# Extract cookies
interaction_cookie=$(printf "%s\n" "$response" | grep _interaction= | awk -F'=' '{print $2}' | awk -F'; ' '{print $1}')
interaction_sig_cookie=$(printf "%s\n" "$response" | grep _interaction.sig= | awk -F'=' '{print $2}' | awk -F'; ' '{print $1}')
interaction_resume_cookie=$(printf "%s\n" "$response" | grep _interaction_resume= | awk -F'=' '{print $2}' | awk -F'; ' '{print $1}')
interaction_resume_sig_cookie=$(printf "%s\n" "$response" | grep _interaction_resume.sig= | awk -F'=' '{print $2}' | awk -F'; ' '{print $1}')
logto_cookie=$(printf "%s\n" "$response" | grep _logto= | awk -F'=' '{print $2}' | awk -F'; ' '{print $1}')

# Sign in
response=$(curl -ik --request PUT 'https://localhost:41100/api/interaction' \
    --header 'content-type: application/json' \
    --header 'Referer: https://localhost:41100/sign-in' \
    --header "Cookie: _interaction=$interaction_cookie; _interaction.sig=$interaction_sig_cookie; _logto={\"appId\":\"$LOGTO__ALP_APP__CLIENT_ID\"}" \
    --data '{
    "event": "SignIn",
    "identifier": {
        "username": "admin",
        "password": "Updatepassword12345"
    }
}')

# Submit sign in page
response=$(curl -ik --request POST 'https://localhost:41100/api/interaction/submit' \
    --header 'accept: application/json' \
    --header 'origin: https://localhost:41100' \
    --header 'referer: https://localhost:41100/sign-in' \
    --header "Cookie: _interaction=$interaction_cookie; _interaction.sig=$interaction_sig_cookie; _logto={\"appId\":\"$LOGTO__ALP_APP__CLIENT_ID\"}")

# Get session
response=$(curl -ik "https://localhost:41100/oidc/auth/$interaction_cookie" \
    --header 'referer: https://localhost:41100/sign-in' \
    --header "Cookie: _interaction=$interaction_cookie; _interaction.sig=$interaction_sig_cookie; _interaction_resume=$interaction_resume_cookie; _interaction_resume.sig=$interaction_resume_sig_cookie; _logto={\"appId\":\"$LOGTO__ALP_APP__CLIENT_ID\"}")

interaction_cookie=$(printf "%s\n" "$response" | grep _interaction= | awk -F'=' '{print $2}' | awk -F'; ' '{print $1}')
interaction_sig_cookie=$(printf "%s\n" "$response" | grep _interaction.sig= | awk -F'=' '{print $2}' | awk -F'; ' '{print $1}')
interaction_resume_cookie=$(printf "%s\n" "$response" | grep _interaction_resume= | awk -F'=' '{print $2}' | awk -F'; ' '{print $1}')
interaction_resume_sig_cookie=$(printf "%s\n" "$response" | grep _interaction_resume.sig= | awk -F'=' '{print $2}' | awk -F'; ' '{print $1}')
logto_cookie=$(printf "%s\n" "$response" | grep _logto= | awk -F'=' '{print $2}' | awk -F'; ' '{print $1}')
session_cookie=$(printf "%s\n" "$response" | grep _session= | awk -F'=' '{print $2}' | awk -F'; ' '{print $1}')
session_sig_cookie=$(printf "%s\n" "$response" | grep _session.sig= | awk -F'=' '{print $2}' | awk -F'; ' '{print $1}')

# Submit consent page
response=$(curl -ik 'https://localhost:41100/consent' \
    --header 'accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7' \
    --header 'referer: https://localhost:41100/sign-in' \
    --header "Cookie: _interaction=$interaction_cookie; _interaction.sig=$interaction_sig_cookie; _interaction_resume=$interaction_resume_cookie; _interaction_resume.sig=$interaction_resume_sig_cookie; _session=$session_cookie; _session.sig=$session_sig_cookie; _logto={\"appId\":\"$LOGTO__ALP_APP__CLIENT_ID\"}")

# Get authorization code
response=$(curl -ik "https://localhost:41100/oidc/auth/$interaction_cookie" \
    --header 'accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7' \
    --header 'referer: https://localhost:41100/sign-in' \
    --header "Cookie: _interaction=$interaction_cookie; _interaction.sig=$interaction_sig_cookie; _interaction_resume=$interaction_resume_cookie; _interaction_resume.sig=$interaction_resume_sig_cookie; _session=$session_cookie; _session.sig=$session_sig_cookie; _logto={\"appId\":\"$LOGTO__ALP_APP__CLIENT_ID\"}")

authorization_code=$(printf "%s\n" "$response" | sed -n 's/.*code=\([^&]*\).*/\1/p' | head -n 1)

# Complete login
response=$(curl -ik "https://localhost:41100/portal/login-callback?code=$authorization_code&state=lbFDB1hcko&iss=https%3A%2F%2Flocalhost%3A41100%2Foidc" \
    --header 'accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7' \
    --header 'referer: https://localhost:41100/sign-in' \
    --header "Cookie: _interaction=$interaction_cookie; _interaction.sig=$interaction_sig_cookie; _interaction_resume=$interaction_resume_cookie; _interaction_resume.sig=$interaction_resume_sig_cookie; _session=$session_cookie; _session.sig=$session_sig_cookie; _logto={\"appId\":\"$LOGTO__ALP_APP__CLIENT_ID\"}")

# Get Bearer token
response=$(curl -ik 'https://localhost:41100/oauth/token' \
    --header 'accept: application/json, text/javascript, */*; q=0.01' \
    --header 'content-type: application/x-www-form-urlencoded' \
    --header "Cookie: _interaction=$interaction_cookie; _interaction.sig=$interaction_sig_cookie; _interaction_resume=$interaction_resume_cookie; _interaction_resume.sig=$interaction_resume_sig_cookie; _session=$session_cookie; _session.sig=$session_sig_cookie; _logto={\"appId\":\"$LOGTO__ALP_APP__CLIENT_ID\"}" \
    --header 'origin: https://localhost:41100' \
    --header 'referer: https://localhost:41100/portal/login-callback?code=2sxkx6uCahwOfKo1cwzLaAq5MfdBJrMcqCLNHvOTXFv&state=odSrnZhVyE&iss=https%3A%2F%2Flocalhost%3A41100%2Foidc' \
    --data-urlencode 'grant_type=authorization_code' \
    --data-urlencode "client_id=$LOGTO__ALP_APP__CLIENT_ID" \
    --data-urlencode 'redirect_uri=https://localhost:41100/portal/login-callback' \
    --data-urlencode "code=$authorization_code" \
    --data-urlencode 'code_verifier=kqVLhCyXRJ3Y9mXie6F9d1FW8AUbTUzIuJiqUf1SM9I')

export BEARER_TOKEN=$(echo "$response" | grep -o '"access_token":"[^"]*"' | sed 's/"access_token":"\([^"]*\)"/\1/')

echo "BEARER TOKEN:"
echo $BEARER_TOKEN
# Get the idp sub

decode_base64_url() {
    local len=$((${#1} % 4))
    local result="$1"
    if [ $len -eq 2 ]; then
        result="$1"'=='
    elif [ $len -eq 3 ]; then
        result="$1"'='
    fi
    echo "$result" | tr '_-' '/+' | openssl enc -d -base64
}

decode_jwt() {
    decode_base64_url $(echo -n $2 | cut -d "." -f $1)
}

DECODED_TOKEN="$(decode_jwt 2 $BEARER_TOKEN)"
echo "DECODED TOKEN:"
echo $DECODED_TOKEN
IDP_SUB=$(echo $(echo $DECODED_TOKEN | grep -o '"sub":"[^"]*"' | awk -F':' '{print $2}' | tr -d '"'))
echo "IDP SUB:"
echo $IDP_SUB

# Endpoint to update user management with idp user id
response=$(curl -ik 'https://localhost:41100/usermgmt/api/user-group/list' \
    -H 'accept: application/json, text/plain, */*' \
    -H "authorization: Bearer $BEARER_TOKEN" \
    -H 'content-type: application/json' \
    -H 'origin: https://localhost:41100' \
    -H 'referer: https://localhost:41100/portal/no-access' \
    --data-raw "{\"userId\":\"$IDP_SUB\"}")
printf "%s\n" "$response"
USER_MGMT_ID=$(printf "%s\n" "$response" | grep -o '"userId":"[^"]*"' | awk -F':' '{print $2}' | tr -d '"')
echo "USER MGMT ID:"
echo $USER_MGMT_ID

# Update roles

curl -ik 'https://localhost:41100/usermgmt/api/user-group/register-tenant-roles' \
    -H 'accept: application/json, text/plain, */*' \
    -H "authorization: Bearer $BEARER_TOKEN" \
    -H 'content-type: application/json' \
    -H 'origin: https://localhost:41100' \
    -H 'referer: https://localhost:41100/portal/systemadmin/user-overview' \
    --data-raw "{\"userId\":\"$USER_MGMT_ID\",\"tenantId\":\"e0348e4d-2e17-43f2-a3c6-efd752d17c23\",\"roles\":[\"TENANT_VIEWER\"]}"

curl -ik 'https://localhost:41100/usermgmt/api/alp-data-admin/register' \
    -H 'accept: application/json, text/plain, */*' \
    -H "authorization: Bearer $BEARER_TOKEN" \
    -H 'content-type: application/json' \
    -H 'origin: https://localhost:41100' \
    -H 'referer: https://localhost:41100/portal/systemadmin/user-overview' \
    --data-raw "{\"userId\":\"$USER_MGMT_ID\",\"roles\":[\"ALP_SYSTEM_ADMIN\",\"ALP_SQLEDITOR_ADMIN\"],\"system\":\"Research System\"}"

curl -ik 'https://localhost:41100/usermgmt/api/alp-user/register' \
    -H 'accept: application/json, text/plain, */*' \
    -H "authorization: Bearer $BEARER_TOKEN" \
    -H 'content-type: application/json' \
    -H 'origin: https://localhost:41100' \
    -H 'referer: https://localhost:41100/portal/systemadmin/user-overview' \
    --data-raw "{\"userId\":\"$USER_MGMT_ID\",\"roles\":[\"ALP_USER_ADMIN\",\"ALP_DASHBOARD_VIEWER\"]}"

### END OF LOG IN

# Install dependencies in backend integration tests
cd ./tests/backend_integration_tests
yarn

# Run HTTP tests ***
yarn test-specs --test_schema_name=JEROME_HTTP_TEST

# Remove Test DB
# yarn removetestdb
