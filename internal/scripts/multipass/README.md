# Canonical Multipass

## Start multi-pass Ubuntu VM

- docker installed
- this repo mounted to ~/d2e

```bash
./start-mp.sh
```

# Prerequisites

## vscode configuration

- on Mac (Sequoia) or later open **Settings>Privacy & Security>Local Network** and allow VS Code

  - otherwise vscode terminal ssh/shell to multipass VM is blocked

- set correct docker location in VM is using remoting docker extension

```json
{
  "docker.dockerPath": "/usr/bin/docker"
}
```

## ~/.ssh/config

- add

```
Host d2e
	HostName d2e.local
	IdentityFile ~/.ssh/vm.id_rsa
	SetEnv TERM=xterm
	StrictHostKeyChecking no
	User ubuntu
	LocalForward 127.0.0.1:41191 127.0.0.1:41190 # pg
	LocalForward 127.0.0.1:41120 127.0.0.1:41120 # prefect
```

## Clean

```bash
multipass list
multipass list --format yaml | yq  'keys.[]' | xargs -n 1 multipass delete --purge
```

## Troubleshooting

- restart if not started automatically on macos reboot

```bash
sudo launchctl unload /Library/LaunchDaemons/com.canonical.multipassd.plist
sudo launchctl load /Library/LaunchDaemons/com.canonical.multipassd.plist
```

### Logs

- https://canonical.com/multipass/docs/accessing-logs
- CLI

```bash
journalctl --unit 'snap.multipass*'
```

- GUI

```bash
cat ~/snap/multipass/current/data/multipass_gui/multipass_gui.log
```

## Networking

- https://discourse.ubuntu.com/t/how-to-troubleshoot-networking-on-macos/12901
- https://canonical.com/multipass/docs#heading--potential-workaround-for-vpn-conflicts

- note: routes added by VPN software are generally cleared on reboot

## References

- https://canonical.com/multipass
- https://canonical.com/multipass/docs
- https://cloud-init.io
- https://cloudinit.readthedocs.io/en/latest/
