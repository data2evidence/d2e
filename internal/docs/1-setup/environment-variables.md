## Manual Copy of Logto Apps Env

Look for the below Logto App Client IDs & Secrets in 
- Local / `.env.local`: copy over to `.env.private.yml`
- Remote / `.env.remote`: copy over to `.env.<respecitve-vm>.yml`
- When porting over, <b>Replace</b> `key=value` -> `key: value` format

```
LOGTO__ALP_SVC__CLIENT_ID
LOGTO__ALP_SVC__CLIENT_SECRET
LOGTO__ALP_DATA__CLIENT_ID
LOGTO__ALP_DATA__CLIENT_SECRET
LOGTO__ALP_APP__CLIENT_ID
LOGTO__ALP_APP__CLIENT_SECRET
```
