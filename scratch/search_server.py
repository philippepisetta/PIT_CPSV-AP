def print_lines(filepath, start_line, end_line):
    print(f"=== {filepath} (Lines {start_line}-{end_line}) ===")
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    for idx in range(start_line - 1, min(end_line, len(lines))):
        line = lines[idx].rstrip()
        line_safe = line.encode('ascii', errors='replace').decode('ascii')
        print(f"{idx+1}: {line_safe}")
    print("\n")

print_lines("src/server.ts", 5530, 5570)
