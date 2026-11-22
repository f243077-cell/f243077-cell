"""Draw the README banner (dark + light SVG) in the portfolio's charcoal & sand palette.
Usage: python .github/scripts/banner.py assets/readme
"""
import sys
from pathlib import Path

SANS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"
W, H = 1280, 420

THEMES = {
    "dark": dict(
        bg="#18191b", border="#d8c6a0", border_op=0.16, dot="#d8c6a0", dot_op=0.07,
        glow="#d8c6a0", glow_op=0.10,
        text="#f6f0e2", muted="#c4ae82", subtle="#ac9970", accent="#d8c6a0", status="#8fb89c",
        hues=["#d8c6a0", "#a3a8ae", "#8fb89c", "#d39a80"],   # sand, stone, sage, clay
        top=0.16, left=0.30, right=0.22,
    ),
    "light": dict(
        bg="#f6f0e2", border="#18191b", border_op=0.12, dot="#18191b", dot_op=0.07,
        glow="#ac9970", glow_op=0.16,
        text="#18191b", muted="#5e5340", subtle="#6b5d40", accent="#7a6845", status="#4f7a5c",
        hues=["#a88d57", "#6f767d", "#5a8a69", "#b2694a"],
        top=0.20, left=0.42, right=0.32,
    ),
}

LAYERS = [  # top of the stack first
    ("Flutter apps", "AcadAI Â· CreateResume AI"),
    ("FastAPI + realtime", "PlayGrid Â· BioGuard"),
    ("RAG + agents Â· MCP", "CiteRAG Â· OnCallPilot"),
    ("QLoRA fine-tuning", "RU-Guard, in progress"),
]


def blend(fg, bg, a):
    f = [int(fg[i:i + 2], 16) for i in (1, 3, 5)]
    b = [int(bg[i:i + 2], 16) for i in (1, 3, 5)]
    return "#" + "".join(f"{round(b[i] + a * (f[i] - b[i])):02x}" for i in range(3))


def pts(*xy):
    return " ".join(f"{x:g},{y:g}" for x, y in xy)


def build(name):
    t = THEMES[name]
    cx, w, h, th, gap, y0 = 940, 260, 130, 14, 60, 70
    hw, hh = w / 2, h / 2
    out = []
    a = out.append

    a(f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" role="img" '
      f'aria-label="Tanzeel Hussain, Full-Stack GenAI Engineer: RAG, AI agents, MCP, QLoRA fine-tuning, FastAPI and Flutter">')
    a(f"""<style>
  .edge {{ stroke-opacity: .45; animation: pulse 6s ease-in-out infinite; }}
  .l1 {{ animation-delay: 1.5s; }} .l2 {{ animation-delay: 3s; }} .l3 {{ animation-delay: 4.5s; }}
  @keyframes pulse {{ 0%, 30%, 100% {{ stroke-opacity: .45; }} 12% {{ stroke-opacity: 1; }} }}
  @media (prefers-reduced-motion: reduce) {{ .edge {{ animation: none; stroke-opacity: .8; }} }}
</style>""")
    a("<defs>")
    a(f'<pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse">'
      f'<circle cx="2" cy="2" r="1.1" fill="{t["dot"]}" fill-opacity="{t["dot_op"]}"/></pattern>')
    a(f'<radialGradient id="glow" cx="{cx}" cy="230" r="330" gradientUnits="userSpaceOnUse">'
      f'<stop offset="0" stop-color="{t["glow"]}" stop-opacity="{t["glow_op"]}"/>'
      f'<stop offset="1" stop-color="{t["glow"]}" stop-opacity="0"/></radialGradient>')
    a("</defs>")
    a("<g>")
    a(f'<rect width="{W}" height="{H}" rx="24" fill="{t["bg"]}"/>')
    a(f'<rect width="{W}" height="{H}" rx="24" fill="url(#dots)"/>')
    a(f'<rect width="{W}" height="{H}" rx="24" fill="url(#glow)"/>')

    # ---- left column: who and what ----
    a(f'<circle cx="78" cy="105" r="5" fill="{t["status"]}"/>')
    a(f'<text x="94" y="110" font-family="{SANS}" font-size="15" fill="{t["muted"]}">'
      f'Open to GenAI and Flutter roles Â· remote or on-site</text>')
    a(f'<text x="72" y="186" font-family="{SANS}" font-size="64" font-weight="800" fill="{t["text"]}" '
      f'letter-spacing="-1">Tanzeel Hussain</text>')
    a(f'<text x="72" y="234" font-family="{SANS}" font-size="28" font-weight="600" fill="{t["accent"]}">'
      f'Full-Stack GenAI Engineer</text>')
    a(f'<text x="72" y="274" font-family="{SANS}" font-size="17" fill="{t["muted"]}">'
      f'RAG Â· AI agents Â· MCP Â· QLoRA fine-tuning Â· FastAPI Â· Flutter</text>')
    a(f'<rect x="72" y="306" width="40" height="2" fill="{t["accent"]}"/>')
    a(f'<text x="72" y="344" font-family="{SANS}" font-size="15" fill="{t["subtle"]}">'
      f'Software Engineering at FAST-NUCES Â· Faisalabad, Pakistan</text>')

    # ---- right: the stack, drawn bottom slab first so upper slabs cover it ----
    for i in reversed(range(len(LAYERS))):
        y = y0 + i * gap
        hue = t["hues"][i]
        top = pts((cx, y), (cx + hw, y + hh), (cx, y + h), (cx - hw, y + hh))
        left = pts((cx - hw, y + hh), (cx, y + h), (cx, y + h + th), (cx - hw, y + hh + th))
        right = pts((cx + hw, y + hh), (cx, y + h), (cx, y + h + th), (cx + hw, y + hh + th))
        a(f'<polygon points="{left}" fill="{blend(hue, t["bg"], t["left"])}"/>')
        a(f'<polygon points="{right}" fill="{blend(hue, t["bg"], t["right"])}"/>')
        a(f'<polygon class="edge l{i}" points="{top}" fill="{blend(hue, t["bg"], t["top"])}" '
          f'stroke="{hue}" stroke-width="1.5" stroke-linejoin="round"/>')

    # labels off each slab's right corner
    for i, (title, sub) in enumerate(LAYERS):
        y = y0 + i * gap + hh
        hue = t["hues"][i]
        a(f'<circle cx="{cx + hw}" cy="{y}" r="3.5" fill="{hue}"/>')
        a(f'<line x1="{cx + hw + 6}" y1="{y}" x2="{cx + hw + 18}" y2="{y}" stroke="{hue}" stroke-width="1.5"/>')
        a(f'<text x="{cx + hw + 24}" y="{y - 2}" font-family="{SANS}" font-size="15" font-weight="600" '
          f'fill="{t["text"]}">{title}</text>')
        a(f'<text x="{cx + hw + 24}" y="{y + 16}" font-family="{SANS}" font-size="12.5" '
          f'fill="{t["muted"]}">{sub}</text>')

    a("</g>")
    a(f'<rect x="0.5" y="0.5" width="{W - 1}" height="{H - 1}" rx="23.5" fill="none" '
      f'stroke="{t["border"]}" stroke-opacity="{t["border_op"]}"/>')
    a("</svg>")
    return "\n".join(out) + "\n"


if __name__ == "__main__":
    out = Path(sys.argv[1])
    for name in THEMES:
        (out / f"banner-{name}.svg").write_text(build(name), encoding="utf-8", newline="\n")
        print("wrote", out / f"banner-{name}.svg")
