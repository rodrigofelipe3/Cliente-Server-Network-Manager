import socket
import mss
import time
import struct
from PIL import Image
from io import BytesIO

# Configuração do socket
server_ip = 'localhost'
server_port = 5000
client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
client_socket.connect((server_ip, server_port))


def capturar_e_enviar():
    with mss.mss() as sct:
        while True:
            # Capturar a tela
            screenshot = sct.grab(sct.monitors[1])

            # Converter a captura para uma imagem PIL
            img = Image.frombytes('RGB', screenshot.size, screenshot.bgra, 'raw', 'BGRX')

            # Converter a imagem para bytes
            img_bytes = BytesIO()
            img.save(img_bytes, format='JPEG')
            data = img_bytes.getvalue()

            # Enviar o tamanho da imagem seguido da imagem em si
            tamanho = struct.pack("!I", len(data))
            client_socket.sendall(tamanho + data)
            dados, _ = client_socket.recvfrom(1024)
            coordenadas = dados.decode()
            
            # Separar as coordenadas
            x, y = map(int, coordenadas.split(','))
            print(x, y)
            # Manter o intervalo para 30 FPS
            time.sleep(1 / 30)

# Iniciar a captura e envio
capturar_e_enviar()
