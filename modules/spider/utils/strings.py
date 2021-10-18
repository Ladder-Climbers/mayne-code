def my_strip(s: str) -> str:
    removed_chars = ['\n', ' ', '\t']
    s = s.strip()
    for r in removed_chars:
        s = s.replace(r, '')
    return s
