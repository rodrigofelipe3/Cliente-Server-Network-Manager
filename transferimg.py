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
from pynput.mouse import Controller, Button

SERVER_IP = '10.10.1.139'
SERVER_PORT = 12345

FRAME_RATE = 1/60  # Target frame rate of 60fps
mouse_control_active = False  # Controle de ativação do mouse, gerenciado pelo servidor
mouse_controller = Controller()

def get_screens_info():
    screens_info = []
    for monitor in get_monitors():
        screens_info.append((monitor.x, monitor.y, monitor.width, monitor.height))
    return screens_info

def send_screen(s, mouse_icon_path, screen_number):
    screens_info = get_screens_info()
    s.sendall(pickle.dumps(screens_info))

    screen_number = struct.unpack("!I", s.recv(4))[0]
    print(screen_number)
    with mss.mss() as sct:
        while True:
            x, y, width, height = screens_info[screen_number]
            monitor = {"top": y, "left": x, "width": width, "height": height}
            
            sct_img = sct.grab(monitor)
            screenshot = Image.frombytes("RGB", sct_img.size, sct_img.rgb)
            #screenshot = draw_mouse_on_screenshot(screenshot, mouse_icon_path)
            
            buffer = io.BytesIO()
            screenshot.save(buffer, format="JPEG", quality=70)  # Lower JPEG quality for faster transfer
            data = buffer.getvalue()
        
            serialized_data = pickle.dumps(data)
            message_size = struct.pack("!L", len(serialized_data))
            s.sendall(message_size + serialized_data)
            
            time.sleep(FRAME_RATE)

def draw_mouse_on_screenshot(screenshot, mouse_icon_path):
    mouse_x, mouse_y = pyautogui.position()
    mouse_icon = Image.open(mouse_icon_path).convert("RGBA")
    icon_size = (16, 16)
    mouse_icon = mouse_icon.resize(icon_size, Image.LANCZOS)
    screenshot.paste(mouse_icon, (mouse_x, mouse_y), mouse_icon)
    return screenshot

def process_mouse_command(command):
    """Processa e executa um comando de mouse."""
    global mouse_control_active
    last_scroll_pos = 0  # Última posição conhecida do scroll para comparação
    button_pressed = False  # Estado do botão pressionado para drag

    try:
        command = command.replace("mouse:", "")
        parts = command.split(' ')

        if len(parts) == 4:
            x_part, y_part, click_part, scroll_part = parts
            x = int(x_part.split(':')[1]) if "none" not in x_part else None
            y = int(y_part.split(':')[1]) if "none" not in y_part else None
            click_type = click_part.split(':')[1] if "none" not in click_part else None
            scroll_pos = int(scroll_part.split(':')[1]) if "none" not in scroll_part else None
            
            if x is not None and y is not None:
                print(f"Moving to x:{x}, y:{y}")
                mouse_controller.position = (x, y)

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

            if scroll_pos is not None and scroll_pos != last_scroll_pos:
                mouse_controller.scroll(0, scroll_pos)
                last_scroll_pos = scroll_pos
        else:
            print("Formato inválido de coordenadas.")
    except Exception as e:
        print(f"Erro ao processar coordenadas: {e}")

def process_keyboard_command(commands):
    """Processa e executa uma lista de comandos de teclado."""

    key_mappings = {
        "Key.enter": "enter",
        "Key.space": "space",
        "Key.shift": "shift",
        "Key.ctrl": "ctrl",
        "Key.alt": "alt",
        "Key.tab": "tab",
        "Key.esc": "esc",
        "Key.backspace": "backspace",
        "Key.left": "left",
        "Key.right": "right",
        "Key.up": "up",
        "Key.down": "down",

    }
    keys = commands
    try:
        # Verifica se o comando é um dos atalhos especiais
       
        for key in commands:
            crlc=repr("\x03")
            crlv=repr("\x16")
            crla=repr("\x01")
            if key == crlc.replace("'",""):  # CTRL+C
                print("Executado CTRL+C")
                pyautogui.hotkey('ctrl', 'c')

            elif key == crlv.replace("'",""): # CTRL+V
                pyautogui.hotkey('ctrl', 'v')
                print("Executado CTRL+V")

            elif key == crla.replace("'",""):  # CTRL+A
                pyautogui.hotkey('ctrl', 'a')
                print("Executado CTRL+A")

            if key in key_mappings:
                pyautogui.press(key_mappings[key])
            else:
                pyautogui.press(key)  # Envia diretamente a tecla
            print(f"Tecla pressionada: {key}")
            print(key == "\x03")
        
    except Exception as e:
        print(f"Erro ao pressionar a tecla {key}: {e}")

def receive_commands(s):
    while True:
        try:
            data = s.recv(1024)
            if not data:
                break
            command = data.decode('utf-8')
            if command.startswith("mouse:"):
                process_mouse_command(command)
            elif command.startswith("key:"):
                commands = command.replace("key:", "").split()
                process_keyboard_command(commands)
            else:
                print("Comando desconhecido.")
        except Exception as e:
            print(f"Erro ao receber comandos: {e}")
            break

def main(mouse_icon_path, screen_number):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.connect((SERVER_IP, SERVER_PORT))

        command_thread = threading.Thread(target=receive_commands, args=(s,), daemon=True)
        command_thread.start()

        send_screen(s, mouse_icon_path, screen_number)


if __name__ == "__main__":
    mouse_icon_path = "./mouse-cursor.png"
    main(mouse_icon_path, 0)
