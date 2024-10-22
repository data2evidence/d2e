# env-vars cli

- keys with type=password

```bash
cat $DOC_YML | yq 'with_entries(select(.value.type == "password")) | keys'
```

- - keys with type!=password

```bash
cat $DOC_YML | yq 'with_entries(select(.value.type != "password")) | keys'
```

- keys with type=boolean

```bash
cat $DOC_YML | yq 'with_entries(select(.value.type == "boolean")) | keys'
```

- keys with type!=boolean

```bash
cat $DOC_YML | yq -C 'with_entries(select(.value.type != "password"))' | less -SR
```
