import sys, os

if len(sys.argv) < 3:
    print("Usage: python3 write_file.py <path> <b64_content>")
    sys.exit(1)

import base64
path = sys.argv[1]
content = base64.b64decode(sys.argv[2]).decode("utf-8")
os.makedirs(os.path.dirname(path), exist_ok=True)
with open(path, "w") as f:
    f.write(content)
print("Saved:", path)
