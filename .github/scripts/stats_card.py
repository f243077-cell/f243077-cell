"""Draw the README's GitHub stats card (dark + light SVG) from the GitHub API.

Replaces the hosted github-readme-stats widget, which went offline. Runs
daily from .github/workflows/stats-card.yml; stdlib only, so the Action
needs no dependencies. GITHUB_TOKEN is used when present (higher rate
limits) but not required for a local run.
"""
import json
import os
import urllib.request
from pathlib import Path

USER = "f243077-cell"
ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "assets" / "readme"

# Languages that are build/config noise in any repo.
BUILD = {"Makefile", "CMake", "Dockerfile", "Shell", "Batchfile", "PowerShell", "Mako"}
# Code `flutter create` generates for the platform runners — not written by hand.
FLUTTER_RUNNERS = {"C++", "C", "Swift", "Kotlin", "Java", "Objective-C", "HTML"}

# Same tokens as the banner and the portfolio site: one accent, ink/bone neutrals.
THEMES = {
    "dark": dict(bg="#12110f", border="#eee8dd", border_op=0.09, text0="#eee8dd",
                 text2="#a39b8e", accent="#4aa6f5", track="#eee8dd", track_op=0.08),
    "light": dict(bg="#f5f1ea", border="#12110f", border_op=0.10, text0="#12110f",
                  text2="#6b645a", accent="#1f78c8", track="#12110f", track_op=0.08),
}
# Tints of the single accent, strongest first, for the language bar.
TINTS = [1.0, 0.72, 0.52, 0.38, 0.27, 0.18]

SANS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"
SERIF = "Georgia, 'Times New Roman', serif"


def api(path):
    req = urllib.request.Request(f"https://api.github.com{path}",
                                 headers={"Accept": "application/vnd.github+json",
                                          "User-Agent": f"{USER}-stats-card"})
    token = os.environ.get("GITHUB_TOKEN")
    if token:
        req.add_header("Authorization", f"Bearer {token}")
    with urllib.request.urlopen(req) as r:
        return json.load(r)


def collect():
    repos = [r for r in api(f"/users/{USER}/repos?per_page=100&type=owner") if not r["fork"]]
    totals = {}
    for repo in repos:
        langs = api(f"/repos/{USER}/{repo['name']}/languages")
        skip = set(BUILD)
        if "Dart" in langs:
            skip |= FLUTTER_RUNNERS
        if "CMake" in langs:
            skip.add("C")  # CMake's compiler-ID probe files
        for lang, size in langs.items():
            if lang not in skip:
                totals[lang] = totals.get(lang, 0) + size
    commits = api(f"/search/commits?q=author:{USER}&per_page=1")["total_count"]
    grand = sum(totals.values()) or 1
    ranked = sorted(totals.items(), key=lambda kv: kv[1], reverse=True)
    used = [lang for lang, size in ranked if size / grand >= 0.01]
    return dict(
        repos=len(repos),
        commits=commits,
        language_count=len(used),
        top=[(lang, size / grand) for lang, size in ranked[:6]],
    )


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;")


def build(stats, theme):
    t = THEMES[theme]
    W, H = 1280, 250
    parts = []

    def label(x, y, text, size=15, fill=None, weight=400, family=SANS, anchor="start"):
        parts.append(
            f'<text x="{x}" y="{y}" font-family="{family}" font-size="{size}" '
            f'font-weight="{weight}" fill="{fill or t["text2"]}" text-anchor="{anchor}">{esc(text)}</text>'
        )

    # Left: three figures
    label(72, 70, "On GitHub", 16, t["accent"], 600)
    parts.append(f'<rect x="72" y="84" width="24" height="1.5" fill="{t["accent"]}"/>')
    figures = [
        (stats["repos"], "public repositories"),
        (stats["commits"], "public commits"),
        (stats["language_count"], "languages in use"),
    ]
    for i, (num, text) in enumerate(figures):
        x = 72 + i * 175
        label(x, 158, f"{num:,}", 58, t["text0"], 400, SERIF)
        label(x, 188, text)

    # Right: language share bar + legend
    bx, bw = 640, 568
    label(bx, 70, "Languages by code written", 16, t["accent"], 600)
    parts.append(f'<rect x="{bx}" y="84" width="24" height="1.5" fill="{t["accent"]}"/>')
    parts.append(f'<clipPath id="bar"><rect x="{bx}" y="112" width="{bw}" height="12" rx="6"/></clipPath>')
    parts.append(f'<rect x="{bx}" y="112" width="{bw}" height="12" rx="6" fill="{t["track"]}" fill-opacity="{t["track_op"]}"/>')
    seg, x = [], bx
    for i, (lang, share) in enumerate(stats["top"]):
        w = share * bw
        seg.append(f'<rect x="{x:.1f}" y="112" width="{w:.1f}" height="12" fill="{t["accent"]}" fill-opacity="{TINTS[i]}"/>')
        x += w
    parts.append(f'<g clip-path="url(#bar)">{"".join(seg)}</g>')
    for i, (lang, share) in enumerate(stats["top"]):
        col, row = i % 3, i // 3
        lx, ly = bx + col * 192, 162 + row * 30
        parts.append(f'<rect x="{lx}" y="{ly - 10}" width="10" height="10" rx="2" fill="{t["accent"]}" fill-opacity="{TINTS[i]}"/>')
        label(lx + 18, ly, lang, 15, t["text0"], 500)
        label(lx + 176, ly, f"{share * 100:.1f}%", 14, anchor="end")

    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" role="img" aria-label="GitHub stats for {USER}: {stats['repos']} public repositories, {stats['commits']} public commits; top languages {', '.join(l for l, _ in stats['top'][:3])}">
  <rect x="0.5" y="0.5" width="{W - 1}" height="{H - 1}" rx="27.5" fill="{t["bg"]}" stroke="{t["border"]}" stroke-opacity="{t["border_op"]}"/>
  {"".join(parts)}
</svg>
"""


if __name__ == "__main__":
    stats = collect()
    print(json.dumps(stats, indent=2))
    OUT.mkdir(parents=True, exist_ok=True)
    for theme in THEMES:
        (OUT / f"stats-{theme}.svg").write_text(build(stats, theme), encoding="utf-8", newline="\n")
