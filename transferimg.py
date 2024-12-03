import socket
import pyautogui
import pickle
import struct
import time
import io
import mss
from PIL import Image
from screeninfo import get_monitors
import threading
from pynput.keyboard import Controller, Key

SERVER_IP = '10.10.1.139'
SERVER_PORT = 8080

mouse_control_active = False  # Controle de ativação do mouse, gerenciado pelo servidor
mouse_controller = Controller()
screen_number = 0  # Número inicial da tela a ser capturada, agora global
keyboard_controller = Controller()
server_screen_width = 0
new_width = None
new_height = None

def get_screens_info():
    screens_info = []
    for monitor in get_monitors():
        screens_info.append((monitor.x, monitor.y, monitor.width, monitor.height))
    return screens_info

def send_screen(s, mouse_icon_path):
    global screen_number, server_screen_width, new_width, new_height
    with mss.mss() as sct:
        screens_info = get_screens_info()
        s.sendall(pickle.dumps(screens_info))
        
        while True:
            
            x, y, width, height = screens_info[screen_number]
            if server_screen_width > 1366:
                new_width = 1366
                new_height = 768
                monitor = {"top": y, "left": x, "width": width, "height": height}
                sct_img = sct.grab(monitor)
                
                # Converte para uma imagem Pillow
                screenshot = Image.frombytes("RGB", sct_img.size, sct_img.rgb)
                
                # Redimensiona a imagem para as novas dimensões
                resized_screenshot = screenshot.resize((new_width, new_height), Image.LANCZOS)
                
                # Converte a imagem redimensionada para buffer
                buffer = io.BytesIO()
                resized_screenshot.save(buffer, format="JPEG", quality=60)  # Lower JPEG quality for faster transfer
                
                # Serializa e envia os dados
                data = buffer.getvalue()
                serialized_data = pickle.dumps(data)
                message_size = struct.pack("!L", len(serialized_data))
                s.sendall(message_size + serialized_data)
                

            elif server_screen_width <= width:
                new_width = 1280
                new_height = 720
                monitor = {"top": y, "left": x, "width": width, "height": height}
                sct_img = sct.grab(monitor)
                
                # Converte para uma imagem Pillow
                screenshot = Image.frombytes("RGB", sct_img.size, sct_img.rgb)
                
                # Redimensiona a imagem para as novas dimensões
                resized_screenshot = screenshot.resize((new_width, new_height), Image.LANCZOS)
                
                # Converte a imagem redimensionada para buffer
                buffer = io.BytesIO()
                resized_screenshot.save(buffer, format="JPEG", quality=60)  # Lower JPEG quality for faster transfer
                
                # Serializa e envia os dados
                data = buffer.getvalue()
                serialized_data = pickle.dumps(data)
                message_size = struct.pack("!L", len(serialized_data))
                s.sendall(message_size + serialized_data)

            else: 
                new_width = 1280
                new_height = 720
                monitor = {"top": y, "left": x, "width": width, "height": height}
                sct_img = sct.grab(monitor)
                
                # Converte para uma imagem Pillow
                screenshot = Image.frombytes("RGB", sct_img.size, sct_img.rgb)
                
                # Redimensiona a imagem para as novas dimensões
                resized_screenshot = screenshot.resize((new_width, new_height), Image.LANCZOS)
                
                # Converte a imagem redimensionada para buffer
                buffer = io.BytesIO()
                resized_screenshot.save(buffer, format="JPEG", quality=80)  # Lower JPEG quality for faster transfer
                
                # Serializa e envia os dados
                data = buffer.getvalue()
                serialized_data = pickle.dumps(data)
                message_size = struct.pack("!L", len(serialized_data))
                s.sendall(message_size + serialized_data)

    time.sleep(1/60)
                

def draw_mouse_on_screenshot(screenshot, mouse_icon_path):
    mouse_x, mouse_y = pyautogui.position()
    mouse_icon = Image.open(mouse_icon_path).convert("RGBA")
    icon_size = (16, 16)
    mouse_icon = mouse_icon.resize(icon_size, Image.LANCZOSS)
    screenshot.paste(mouse_icon, (mouse_x, mouse_y), mouse_icon)
    return screenshot

def process_keyboard_command(commands):
    # Mapeamento de teclas de controle e seus códigos ASCII
    ctrl_combinations = {
        repr("\x01"): "a",  # CTRL+A
        repr("\x02"): "b",  # CTRL+B
        repr("\x03"): "c",  # CTRL+C
        repr("\x04"): "d",  # CTRL+D
        repr("\x05"): "e",  # CTRL+E
        repr("\x06"): "f",  # CTRL+F
        repr("\x07"): "g",  # CTRL+G
        repr("\x08"): "h",  # CTRL+H
        repr("\x09"): "i",  # CTRL+I
        repr("\x0A"): "j",  # CTRL+J
        repr("\x0B"): "k",  # CTRL+K
        repr("\x0C"): "l",  # CTRL+L
        repr("\x0D"): "m",  # CTRL+M
        repr("\x0E"): "n",  # CTRL+N
        repr("\x0F"): "o",  # CTRL+O
        repr("\x10"): "p",  # CTRL+P
        repr("\x11"): "q",  # CTRL+Q
        repr("\x12"): "r",  # CTRL+R
        repr("\x13"): "s",  # CTRL+S
        repr("\x14"): "t",  # CTRL+T
        repr("\x15"): "u",  # CTRL+U
        repr("\x16"): "v",  # CTRL+V
        repr("\x17"): "w",  # CTRL+W
        repr("\x18"): "x",  # CTRL+X
        repr("\x19"): "y",  # CTRL+Y
        repr("\x1A"): "z",  # CTRL+Z
    }

    # Mapeamento de teclas especiais
    key_mappings = {
        "Key.enter": Key.enter,
        "Key.space": Key.space,
        "Key.shift": Key.shift,
        "Key.ctrl": Key.ctrl,
        "Key.alt": Key.alt,
        "Key.tab": Key.tab,
        "Key.esc": Key.esc,
        "Key.backspace": Key.backspace,
        "Key.left": Key.left,
        "Key.right": Key.right,
        "Key.up": Key.up,
        "Key.down": Key.down,
        "Key.esc": Key.esc
    }

    # Mapeamento de teclas do teclado numérico
    numpad_keys = {
        "<96>": "0",  # NumPad 0
        "<97>": "1",  # NumPad 1
        "<98>": "2",  # NumPad 2
        "<99>": "3",  # NumPad 3
        "<100>": "4",  # NumPad 4
        "<101>": "5",  # NumPad 5
        "<102>": "6",  # NumPad 6
        "<103>": "7",  # NumPad 7
        "<104>": "8",  # NumPad 8
        "<105>": "9",  # NumPad 9
        "<110>": ".",  # NumPad .
        "<111>": "/",  # NumPad /
        "<106>": "*",  # NumPad *
        "<107>": "+",  # NumPad +
        "<109>": "-",  # NumPad -
    }

    # Mapeamento de combinações SHIFT+Key
    shift_combinations = {
        "!": "1",  # SHIFT+1
        "@": "2",  # SHIFT+2
        "#": "3",  # SHIFT+3
        "$": "4",  # SHIFT+4
        "%": "5",  # SHIFT+5
        "^": "6",  # SHIFT+6
        "&": "7",  # SHIFT+7
        "*": "8",  # SHIFT+8
        "(": "9",  # SHIFT+9
        ")": "0",  # SHIFT+0
    }

    try:
        for key in commands:
            processed = False
            # Verifica combinações CTRL+Key
            for ctrl_code, actual_key in ctrl_combinations.items():
                if key == ctrl_code.replace("'", ""):
                    with keyboard_controller.pressed(Key.ctrl):
                        keyboard_controller.press(actual_key)
                        keyboard_controller.release(actual_key)
                    processed = True
                    break

            if not processed:
                # Verifica combinações SHIFT+Key
                if key in shift_combinations:
                    actual_key = shift_combinations[key]
                    with keyboard_controller.pressed(Key.shift):
                        keyboard_controller.press(actual_key)
                        keyboard_controller.release(actual_key)
                    processed = True

                # Verifica teclas especiais no mapeamento
                elif key in key_mappings:
                    keyboard_controller.press(key_mappings[key])
                    keyboard_controller.release(key_mappings[key])
                    processed = True

                # Verifica teclas do teclado numérico
                elif key in numpad_keys:
                    actual_key = numpad_keys[key]
                    keyboard_controller.press(actual_key)
                    keyboard_controller.release(actual_key)
                    processed = True

                # Verifica se é um acento
                elif key.startswith("[") and key.endswith("]"):
                    accent = key.strip("[]")
                    keyboard_controller.press(accent)
                    keyboard_controller.release(accent)
                    processed = True

                # Verifica teclas simples
                elif len(key) == 1:
                    keyboard_controller.press(key)
                    keyboard_controller.release(key)
                    processed = True

            if not processed:
                None

    except Exception as e:
        None

from pynput.mouse import Controller, Button
mouse_controller = Controller()

# Função para processar comandos de controle do mouse
def process_mouse_command(command):
    global mouse_control_active
    last_scroll_pos = 0  # Última posição conhecida do scroll para comparação
    button_pressed = False  # Estado do botão pressionado para drag

    try:
        # Remove o prefixo "mouse:" e separa os componentes
        command = command.replace("mouse:", "")
        parts = command.split(' ')

        if len(parts) == 4:
            x_part, y_part, click_part, scroll_part = parts
            x = int(x_part.split(':')[1]) if "none" not in x_part else None
            y = int(y_part.split(':')[1]) if "none" not in y_part else None
            click_type = click_part.split(':')[1] if "none" not in click_part else None
            scroll_pos = int(scroll_part.split(':')[1]) if "none" not in scroll_part else None
            
            # Movimenta o mouse se coordenadas forem válidas
            if x is not None and y is not None:
                mouse_controller.position = (x, y)

            # Processa os cliques
            if click_type == "left":
                mouse_controller.press(Button.left)
                mouse_controller.release(Button.left)
                button_pressed = False
            elif click_type == "left_hold" and not button_pressed:
                mouse_controller.press(Button.left)
                button_pressed = True
            elif click_type == "left_hold" and button_pressed:
                pass
            else:
                if button_pressed:
                    mouse_controller.release(Button.left)
                    button_pressed = False

            if click_type == "right":
                mouse_controller.press(Button.right)
                mouse_controller.release(Button.right)
            elif click_type == "middle":
                mouse_controller.press(Button.middle)
                mouse_controller.release(Button.middle)

            # Processa a rolagem do mouse
            if scroll_pos is not None and scroll_pos != last_scroll_pos:
                mouse_controller.scroll(0, scroll_pos)
                last_scroll_pos = scroll_pos
        else:
            None
    except Exception as e:  
        None

def process_mouse_movement(command):

    try:
       
        command = command.replace("mouse:", "").strip()
        parts = command.split()
        
        
        x = int(parts[0].split(":")[1])
        y = int(parts[1].split(":")[1])

        mouse_controller.position = (x, y)
    except Exception as e:
        None

def process_mouse_click(command):
    try: 
        click_type = command.replace("click_type:", "")
        if click_type == "left":
            mouse_controller.press(Button.left)
            mouse_controller.release(Button.left)
        elif click_type == "right":
            mouse_controller.press(Button.right)
            mouse_controller.release(Button.right)
        elif click_type == "middle":
            mouse_controller.press(Button.middle)
            mouse_controller.release(Button.middle)
        
    except Exception as e:
        None

def process_mouse_scroll(command):
    try:
        scroll_value = int(command.replace("scroll:", ""))
        mouse_controller.scroll(0, scroll_value)
        print(f"Processando scroll: {scroll_value}")
    except Exception as e:
        print(f"Erro ao processar scroll: {e}")

def receive_commands(s):
    global screen_number, server_screen_width
    while True:
        try:
            data = s.recv(1024)
            if not data:
                break
            command = data.decode('utf-8')
           
            # Processa comandos individuais
            if command.startswith("mouse:"):
                process_mouse_movement(command)
            elif command.startswith("click_type:"):
                process_mouse_click(command)
            elif command.startswith("scroll:"):
                process_mouse_scroll(command)
            elif command.startswith("key:"):
                commands = command.replace("key:", "").split()
                process_keyboard_command(commands)
            elif command.startswith("screen:"):
                new_screen_number = int(command.replace("screen:", "").strip())
                screen_number = new_screen_number
                if new_screen_number != 1:
                    screens_info = get_screens_info()
                    s.sendall(pickle.dumps(str(screens_info[new_screen_number]).encode()))

            if command.startswith("width:"):
                    parts = command.split()
                    x = int(parts[1])  # Extrai o valor de largura (1920)
                    server_screen_width = x
            else:
                None
        except Exception as e:
            break
    time.sleep(1/60)
    
def main(mouse_icon_path):
    indice = 0
    while indice < 3:  # Loop infinito para tentativa de conexão
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
               
                s.connect((SERVER_IP, SERVER_PORT))
                # Inicia thread para receber comandos
                command_thread = threading.Thread(target=receive_commands, args=(s,), daemon=True)
                command_thread.start()

                # Envia capturas de tela
                send_screen(s, mouse_icon_path)
                
        except (socket.error, OSError) as e:
            indice+=1
            time.sleep(5)  # Aguarda 5 segundos antes de tentar novamente
        except KeyboardInterrupt:
            break

if __name__ == "__main__":
    mouse_icon_path = "./mouse-cursor.png"
    main(mouse_icon_path)

