#!/usr/bin/env bash
# Start multi-pass VM with docker etc installed
set -o nounset
set -o errexit
set -o pipefail

# vars
export VM_NAME=d2e
GIT_BASE_DIR="$(git rev-parse --show-toplevel)"
MOUNT_TARGET=$VM_NAME:/home/ubuntu/d2e
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

# action
echo . launch $VM_NAME

multipass delete --purge $VM_NAME || true
multipass launch -vvv --timeout 1000 --name $VM_NAME --memory 10G --disk 100G --cpus 4 --cloud-init $SCRIPT_DIR/cloud-init.yml

echo . mount GIT_REPO
multipass umount $MOUNT_TARGET || true
multipass mount $GIT_BASE_DIR $MOUNT_TARGET --gid-map $(id -g):1000 --uid-map $(id -u):1000

echo . add to /etc/hosts
sudo sed -i.bak "/$VM_NAME.local/d" /etc/hosts
multipass ls --format yaml | yq '.[env(VM_NAME)][0].ipv4[0]' | xargs -I{} echo {} d2e.local | sudo tee -a /etc/hosts
ssh-keygen -R $VM_NAME.local # remove existing entries

echo . finish

echo . To open shell:
echo ssh $VM_NAME
echo /or/
echo multipass shell $VM_NAME