import requests

host = "http://127.0.0.1:5000/endpoint"
rfid_num = "12345ab"
device_key = "space"

resp = requests.get(host + f"?rfid_num={rfid_num}&device_key={device_key}")
print(resp.status_code, resp.text)