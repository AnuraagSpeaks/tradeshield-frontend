import os

def write_f(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w') as f:
        f.write(content.strip())
    print('Created:', path)

print('build_payshieldx_app.py initialized')
