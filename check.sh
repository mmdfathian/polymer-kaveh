#!/bin/bash
# Pre-push sanity check for polymer-kaveh
# Run before every push: bash check.sh
FAIL=0

echo "=== 1. Truncation artifacts ==="
if grep -rn '\[truncated\]' --include='*.html' --include='*.css' --include='*.js' --include='*.json' . | grep -v '^\./\.git'; then
  echo "❌ CORRUPTED FILE(S) FOUND — do not push"
  FAIL=1
else
  echo "✓ clean"
fi

echo "=== 2. Tag balance (svg / div) per page ==="
for f in *.html; do
  o=$(grep -o '<svg' "$f" | wc -l); c=$(grep -o '</svg>' "$f" | wc -l)
  [ "$o" != "$c" ] && echo "❌ $f: <svg>=$o </svg>=$c" && FAIL=1
done
[ $FAIL -eq 0 ] && echo "✓ svg balanced"

echo "=== 3. CSS braces ==="
o=$(grep -o '{' assets/style.css | wc -l); c=$(grep -o '}' assets/style.css | wc -l)
if [ "$o" != "$c" ]; then echo "❌ style.css braces: $o open vs $c close"; FAIL=1; else echo "✓ balanced ($o)"; fi

echo "=== 4. Key selectors present ==="
for sel in '.reveal' '#loading-overlay' 'calc-form' '.header'; do
  grep -q -- "$sel" assets/style.css || { echo "❌ missing: $sel"; FAIL=1; }
done
[ $FAIL -eq 0 ] && echo "✓ all present"

echo "=== 5. SW cache version changed vs last commit ==="
OLD=$(git show HEAD:sw.js 2>/dev/null | grep -o "v[0-9-]*-[0-9]*" | head -1)
NEW=$(grep -o "v[0-9-]*-[0-9]*" sw.js | head -1)
if [ "$OLD" = "$NEW" ]; then
  echo "⚠️  CACHE_NAME unchanged ($NEW). If css/js/html changed, bump it:"
  echo '   sed -i "s/v\(20[0-9]*\)-01/v\1-02/" sw.js'
else
  echo "✓ bumped ($NEW)"
fi

exit $FAIL
