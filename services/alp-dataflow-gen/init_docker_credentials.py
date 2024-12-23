import sys
from prefect_docker import DockerHost, DockerRegistryCredentials


if __name__ == "__main__":
    username = sys.argv[1]
    password = sys.argv[2]

    docker_host = DockerHost()
    docker_registry_credentials = DockerRegistryCredentials(
        username=username,
        password=password,
        registry_url="alpcr.azurecr.io",
    )

    docker_registry_credentials.save(name="docker-registry-credentials")
