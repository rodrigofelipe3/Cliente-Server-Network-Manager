import mss
import time
import socket
import struct

def send_screenshots(host, port, duration=10, fps=30):
    with mss.mss() as sct:
        monitor = sct.monitors[1]  # Primeiro monitor
        interval = 1 / fps
        end_time = time.time() + duration

        # Cria socket para envio das imagens
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            sock.connect((host, port))

            while time.time() < end_time:
                # Captura a tela
                screenshot = sct.grab(monitor)
                img = mss.tools.to_png(screenshot.rgb, screenshot.size)

                # Envia o tamanho da imagem primeiro
                sock.sendall(struct.pack(">L", len(img)))
                # Envia a imagem
                sock.sendall(img)

                time.sleep(interval)

# Exemplo de uso: envia para o host remoto na porta 5000
send_screenshots(host="127.0.0.1", port=5000, duration=10, fps=30)
