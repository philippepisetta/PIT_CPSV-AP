import os
import glob

# Search in both root and cpsv-ap-app
paths = glob.glob('**/*.ts', recursive=True) + glob.glob('**/*.js', recursive=True)
results = []

for p in paths:
    if 'node_modules' in p or '.next' in p or 'dist' in p or '.gemini' in p:
        continue
    if os.path.isfile(p):
        try:
            content = open(p, encoding='utf-8').read()
            if 'v2/' in content or 'v2/members' in content or 'v2/challenges' in content or 'members' in content.lower() and 'router' in content.lower():
                # Let's count how many times it matches
                count = content.count('v2')
                results.append((p, count))
        except Exception:
            pass

print("--- Files with 'v2' ---")
for r in results:
    print(f"File: {r[0]} (count: {r[1]})")
