# pg_dumpall backup & restore
- https://www.postgresql.org/docs/current/app-pg-dumpall.html
- https://dbdeveloper.medium.com/easy-steps-to-backup-your-postgresql-database-in-2024-15a25a232c7f

# Backup
- full backup - includes postgres database
```bash
BACKUP_DIR=/backups
docker exec -it alp-minerva-postgres-1 pg_dumpall -U postgres | gzip > $BACKUP_DIR/$(date +%Y%m%dT%H%M)Z.all.sql.gz
```