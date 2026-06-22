import re

content = open('src/server.ts', encoding='utf-8').read()

# Let's find lines with app.get, app.post, app.patch, app.put, app.delete containing '/api/v2'
lines = content.split('\n')
v2_routes = []
for i, line in enumerate(lines):
    if '/api/v2' in line or 'v2/' in line:
        v2_routes.append((i+1, line.strip()))

print("--- v2 Routes in src/server.ts ---")
for r in v2_routes[:50]:
    print(f"Line {r[0]}: {r[1]}")
print(f"Total v2 lines found: {len(v2_routes)}")
