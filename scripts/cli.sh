#!/usr/bin/env bash

cmd=${@: -1}
script_full_path=$(dirname "$0")
node_modules_path=$script_full_path/../lib/node_modules/@data2evidence/cli/
export CADDY__CONFIG=$node_modules_path/deploy/caddy-config
export ENV_TYPE=${ENV_TYPE:-remote}

export ENV_EXAMPLE=$node_modules_path/env.example
export GIT_BASE_DIR=.
export ENVFILE=.env

case $cmd in
    start)
        docker compose --file $node_modules_path/docker-compose.yml --env-file .env up --wait
        ;;
    stop)
        docker compose --file $node_modules_path/docker-compose.yml --env-file .env stop
        ;;
    clean)
        read -p "This action will delete all docker containers and volumnes. Continue (y/n)?" choice
        case "$choice" in
            y|Y)
                docker compose --file $node_modules_path/docker-compose.yml --env-file .env down --volumes --remove-orphans
                ;;
            *)
                echo "Aborting";;
        esac
        ;;
    init)
        docker compose --file $node_modules_path/docker-compose.yml --env-file .env up alp-minerva-postgres alp-logto --wait &&
        sleep 10 &&
        docker compose --file $node_modules_path/docker-compose.yml --env-file .env up alp-logto-post-init
        ;;
    genenv)
        $node_modules_path/scripts/gen-dotenv.sh && $node_modules_path/scripts/gen-tls.sh && $node_modules_path/scripts/gen-resource-limits.sh
        ;;
    login)
        source .env &&
        docker login -u $GH_USERNAME -p $GH_TOKEN ghcr.io
        ;;
    *)
        if [ -z ${cmd:-} ]; then
            echo "d2e: command is missing"
        else
            echo "d2e: $cmd is not a d2e command."
        fi
        echo ""
        echo "Usage: d2e COMMAND"
        echo ""
        echo "Commands:"
        echo "  genenv     Generates .env file"
        echo "  login      Login into github"
        echo "  init       Initializes d2e DB"
        echo "  start      Starts d2e services"
        echo "  stop       Stops d2e services"
        echo "  clean      Removes d2e docker containers and volumnes"
        ;;
esac


#docker compose --file $node_modules_path/docker-compose.yml --env-file .env up --wait
