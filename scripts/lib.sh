# library functions - sourced

function random-password {
    PASSWORD_LENGTH=${1}
    echo PASSWORD_LENGTH=$PASSWORD_LENGTH
    LC_ALL=C tr -dc 'A-Za-z0-9' </dev/urandom | head -c ${PASSWORD_LENGTH}
}
