#!/bin/bash

sleep 15

# Read Secrets
swift_user=`cat /var/swift/user`
swift_password=`cat /var/swift/password`
swift_url=`cat /var/swift/url`
swift_tenant=`cat /var/swift/tenant`
swift_remote_alias=`cat /var/swift/remote_alias`

# Create rclone config file
rclone config create ${swift_remote_alias} swift domain Default env_auth false \
	user ${swift_user} \
	key ${swift_password} \
	auth ${swift_url} \
	tenant ${swift_tenant} \
	domain Default >/dev/null

# Begin Sync
node researcher-files-backup.js