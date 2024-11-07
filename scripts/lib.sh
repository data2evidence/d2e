# library functions - sourced

DEFAULT_PASSWORD_LENGTH=30

function random-password {
    PASSWORD_LENGTH=${1}
    LC_ALL=C tr -dc 'A-Za-z0-9' </dev/urandom | head -c ${PASSWORD_LENGTH}
}