curl -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/534.30 (KHTML, like Gecko) Chrome/12.0.742.112 Safari/534.30"  --insecure "https://<hostname>/api/v3/orgs/fhir/repos?page=1&per_page=100" |
  grep -e 'ssh_url*'|
  cut -d \" -f 4 |
  xargs -L1 git clone
