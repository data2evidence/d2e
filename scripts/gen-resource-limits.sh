#!/usr/bin/env bash

# inputs
D2E_RESOURCE_LIMIT=${D2E_RESOURCE_LIMIT:-0.7}
ENV_TYPE=${ENV_TYPE:-local}

# vars
OS="$(uname -s)"
DOTENV_FILE=.env.$ENV_TYPE
touch ${DOTENV_FILE}

echo D2E_RESOURCE_LIMIT=$D2E_RESOURCE_LIMIT

get_cpu_count() {
    if [ "$OS" = "Linux" ]; then
        NPROCS="$(nproc --all)"
    elif [ "$OS" = "Darwin" ] || \
            [ "$(echo "$OS" | grep -q BSD)" = "BSD" ]; then
        NPROCS="$(sysctl -n hw.ncpu)"
    else
        NPROCS="$(getconf _NPROCESSORS_ONLN)"  # glibc/coreutils fallback
    fi
    D2E_CPU_LIMIT=$(echo "scale=2;$NPROCS*$D2E_RESOURCE_LIMIT" |bc)
    # Strip decimal numbers
    D2E_CPU_LIMIT=${D2E_CPU_LIMIT%%.*}
    echo D2E_CPU_LIMIT=$D2E_CPU_LIMIT

    # remove existing env var from dotenv
    sed -i.bak "/D2E_CPU_LIMIT=/,//d" $DOTENV_FILE
    # set env var
    echo D2E_CPU_LIMIT=\'"$D2E_CPU_LIMIT"\' >> $DOTENV_FILE
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
    echo D2E_MEMORY_LIMIT=$D2E_MEMORY_LIMIT

    # remove existing env var from dotenv
    sed -i.bak "/D2E_MEMORY_LIMIT=/,//d" $DOTENV_FILE
    # set env var
    echo D2E_MEMORY_LIMIT=$D2E_MEMORY_LIMIT >> $DOTENV_FILE

}

get_cpu_count
get_memory