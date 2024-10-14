import socket
import threading
import pyautogui
import pickle
import cv2
import numpy as np
import time

pyautogui.FAILSAFE = False
# Variáveis de controle
envio_tela_ativo = False
recebendo_comandos_ativo = False
conectado = False

def enviar_tela(client_socket):
    global envio_tela_ativo
    if envio_tela_ativo:
        return  # Evita iniciar múltiplas threads de envio
    envio_tela_ativo = True

    try:
        while conectado:
            # Captura a tela
            tela = pyautogui.screenshot()
            tela = cv2.cvtColor(np.array(tela), cv2.COLOR_RGB2BGR)
            
            # Converte para formato serializado (bytes)
            _, frame = cv2.imencode('.jpg', tela)
            data = pickle.dumps(frame)

            # Envia tamanho do pacote seguido dos dados
            client_socket.sendall(len(data).to_bytes(4, 'big') + data)
            time.sleep(0.1)  # Pequeno delay para não sobrecarregar

    except socket.error as e:
        print(f"Erro ao enviar tela: {e}")
        client_socket.close()
    finally:
        envio_tela_ativo = False

def receber_comandos(client_socket):
    global recebendo_comandos_ativo, conectado
    if recebendo_comandos_ativo:
        return  # Evita iniciar múltiplas threads de recebimento
    recebendo_comandos_ativo = True

    try:
        while conectado:
            data = client_socket.recv(1024).decode().strip()
            if not data:
                break

            # Comando de movimentação de mouse
            if data.startswith('mouse_click_left'):
                try:
                    _, mouse_x, mouse_y = data.split(',')
                    pyautogui.click(int(mouse_x), int(mouse_y))  # Executa o clique esquerdo
                except ValueError:
                    print(f"Comando 'mouse_click_left' inválido: {data}")
            elif data.startswith('mouse_click_right'):
                try:
                    _, mouse_x, mouse_y = data.split(',')
                    pyautogui.rightClick(int(mouse_x), int(mouse_y))  # Executa o clique direito
                except ValueError:
                    print(f"Comando 'mouse_click_right' inválido: {data}")
            elif data.startswith('mouse'):
                try:
                    _, mouse_x, mouse_y = data.split(',')
                    # Ajusta a posição do mouse com base na resolução
                    largura_tela, altura_tela = pyautogui.size()
                    x_pos = int(int(mouse_x) * largura_tela / 1920)  # Assume 1920 como a largura padrão
                    y_pos = int(int(mouse_y) * altura_tela / 1080)  # Assume 1080 como a altura padrão
                    pyautogui.moveTo(x_pos, y_pos)
                except ValueError:
                    print(f"Comando 'mouse' inválido: {data}")

    except socket.error as e:
        print(f"Erro ao receber comandos: {e}")
        client_socket.close()
    finally:
        recebendo_comandos_ativo = False

def main_cliente():
    global conectado
    server_address = ('10.10.1.45', 12345)  # Coloque o IP do servidor

    while True:
        try:
            client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            client_socket.connect(server_address)
            conectado = True
            print(f"Conectado ao servidor: {server_address}")

            # Envia a resolução da tela para o servidor
            largura_tela, altura_tela = pyautogui.size()
            client_socket.sendall(f"resolucao,{largura_tela},{altura_tela}".encode())

            # Inicia as threads de envio de tela e recebimento de comandos
            threading.Thread(target=enviar_tela, args=(client_socket,)).start()
            threading.Thread(target=receber_comandos, args=(client_socket,)).start()

            # Aguarda até que a conexão seja encerrada
            while conectado:
                time.sleep(1)

        except socket.error as e:
            print(f"Erro de conexão: {e}. Tentando reconectar em 5 segundos...")
            time.sleep(5)
        except KeyboardInterrupt:
            print("Cliente encerrado.")
            break

if __name__ == "__main__":
    main_cliente()
