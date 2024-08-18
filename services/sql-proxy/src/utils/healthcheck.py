import socket
import sys


def tcp_port_check(Host, Port):
    client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client.settimeout(2)  # Timeout in case of port not open
    try:
        client.connect((Host, Port))
        message = 'Is everything ok?'
        client.sendall(message.encode())
        client.close()
        sys.exit(0)
    except Exception as error:
        print("An exception occurred:", error)
        client.close()
        sys.exit(1)


if __name__ == "__main__":
    port = int(sys.argv[1].strip())
    tcp_port_check("localhost", port)
