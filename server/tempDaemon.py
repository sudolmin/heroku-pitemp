#!/usr/bin/python3

import subprocess
import time
import requests
from datetime import datetime

def sendData(cTime, cTemp):
    url = 'http://{rest_api_ip}:8000/api/temp/'
    myobj = {
        'time': cTime,
        'temp': cTemp
    }

    x = requests.post(url, data = myobj)
    print (myobj)

while True:
    now = datetime.now()
    current_time = now.strftime("%H:%M:%S")

    current_temp=subprocess.run('cat /sys/class/thermal/thermal_zone*/temp',capture_output=True , shell=True)
    current_temp=current_temp.stdout.decode("utf-8")
    current_temp=current_temp[:5]
    current_temp=int(current_temp)/1000

    sendData(current_time, current_temp)
    time.sleep(1)

