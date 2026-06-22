import os
import glob
import re

paths = glob.glob('cpsv-ap-app/src/**/*.ts*', recursive=True)
api_calls = {}

for p in paths:
    if os.path.isfile(p):
        try:
            content = open(p, encoding='utf-8').read()
            matches = re.findall(r'[\'"]/api/([^\'"]+)[\'"]', content)
            if matches:
                api_calls[p] = matches
        except Exception as e:
            pass

print("--- API Calls Found in Source Files ---")
for k, v in api_calls.items():
    print(f"File: {k}")
    for m in v:
        print(f"  - /api/{m}")
