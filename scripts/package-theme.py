from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

root = Path(__file__).resolve().parent.parent
theme = root / 'theme' / 'ironwood'
target = root / 'docs' / 'ironwood.zip'
with ZipFile(target, 'w', ZIP_DEFLATED) as archive:
    for path in sorted(theme.rglob('*')):
        if path.is_file():
            archive.write(path, path.relative_to(theme.parent).as_posix())
print(f'Packaged {target} ({target.stat().st_size:,} bytes)')

