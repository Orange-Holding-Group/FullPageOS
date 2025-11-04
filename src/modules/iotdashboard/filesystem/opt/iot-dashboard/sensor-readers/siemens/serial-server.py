import serial

# Adjust these values
PORT = '/dev/cu.usbserial-FTE914RU' #'COM3'          # Windows example, or '/dev/ttyUSB0' on Linux
BAUD = 9600            # or whatever your magnet uses
CMD = b'R?\r\n' # replace with your actual magnet command

with serial.Serial(PORT, BAUD, timeout=1) as ser:
    # send the command to start the stream
    ser.write(CMD)
    print("Command sent, waiting for data...\n")
    
    while True:
        line = ser.readline().decode(errors='ignore').strip()
        if line:
            print(line)