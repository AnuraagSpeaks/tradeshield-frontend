import os

def write_component(name, content):
    path = os.path.join("src/components", name)
    with open(path, "w") as f:
        f.write(content.strip())
    print("Created:", path)
