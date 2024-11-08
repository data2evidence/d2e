#!/usr/bin/env bash
set -o nounset
set -o errexit
echo ${0} ...
echo . INFO generate docker resource limits based on available system resources

# inputs
D2E_RESOURCE_LIMIT=${D2E_RESOURCE_LIMIT:-0.7}
ENV_TYPE=${ENV_TYPE:-local}

echo . inputs: D2E_RESOURCE_LIMIT=$D2E_RESOURCE_LIMIT ENV_TYPE=$ENV_TYPE

# vars
OS="$(uname -s)"
DOTENV_FILE_OUT=.env.$ENV_TYPE
DOTENV_KEYS_OUT=.env.$ENV_TYPE.keys
touch ${DOTENV_FILE_OUT}

# functions
get_cpu_count() {
    if [ "$OS" = "Linux" ]; then
        NPROCS="$(nproc --all)"
    elif [ "$OS" = "Darwin" ] || \
            [ "$(echo "$OS" | grep -q BSD)" = "BSD" ]; then
        NPROCS="$(sysctl -n hw.ncpu)"
    else
        NPROCS="$(getconf _NPROCESSORS_ONLN)"  # glibc/coreutils fallback
    fi
    D2E_CPU_LIMIT=$(echo "scale=2;$NPROCS*$D2E_RESOURCE_LIMIT" | bc)
    # Strip decimal numbers
    D2E_CPU_LIMIT=${D2E_CPU_LIMIT%%.*}

    # remove existing env var from dotenv
    sed -i.bak "/D2E_CPU_LIMIT=/d" $DOTENV_FILE_OUT
    # set env var
    echo D2E_CPU_LIMIT=\'"$D2E_CPU_LIMIT"\' | tee -a $DOTENV_FILE_OUT
}

get_memory() {
    if [ "$OS" = "Darwin" ]; then
        # mem_size=$(sysctl -n hw.memsize)
        MEMORY=$(system_profiler SPHardwareDataType | grep "  Memory:" | awk '{print $2}')
    else
        MEMORY=$(free -g | grep Mem: | awk '{print $2}')
    fi
    D2E_MEMORY_LIMIT=$(echo "scale=2;$MEMORY*$D2E_RESOURCE_LIMIT" |bc)
    # Strip decimal numbers
    D2E_MEMORY_LIMIT=${D2E_MEMORY_LIMIT%%.*}
    # Add G suffix for gigabyte
    D2E_MEMORY_LIMIT=${D2E_MEMORY_LIMIT}G

    # remove existing env var from dotenv
    sed -i.bak "/D2E_MEMORY_LIMIT=/d" $DOTENV_FILE_OUT
    # set env var
    echo D2E_MEMORY_LIMIT=\'"$D2E_MEMORY_LIMIT"\' | tee -a $DOTENV_FILE_OUT

}

# action
get_cpu_count
get_memory

# finalize
cat $DOTENV_FILE_OUT | grep = | awk -F= '{print $1}' | grep _ | sort -u > $DOTENV_KEYS_OUT
wc -l --total never $DOTENV_FILE_OUT $DOTENV_KEYS_OUT
echo