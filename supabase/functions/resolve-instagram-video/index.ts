// Resolves a public Instagram post/reel URL to its direct, playable video file
// URL (og:video meta tag) — the same signal Instagram serves to link-preview
// bots (WhatsApp, Facebook, Telegram, ...). No login/token required, but it
// is unofficial: Instagram can change its markup at any time, and the
// resolved CDN URL is typically time-limited (expires after some hours), so
// callers must re-resolve on every page load rather than caching it.

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const BROWSER_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

function extractMeta(html: string, property: string): string | null {
  // Handles both attribute orders: property="x" content="y" and content="y" property="x"
  const re1 = new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`, 'i');
  const re2 = new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${property}["']`, 'i');
  const m = html.match(re1) || html.match(re2);
  return m ? m[1].replace(/&amp;/g, '&') : null;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    if (!url || typeof url !== 'string' || !/^https?:\/\/(www\.)?instagram\.com\//i.test(url)) {
      return new Response(JSON.stringify({ error: 'Invalid Instagram URL' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const res = await fetch(url, {
      headers: {
        'User-Agent': BROWSER_UA,
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    if (!res.ok) {
      return new Response(JSON.stringify({ error: `Instagram fetch failed (${res.status})` }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const html = await res.text();
    const videoUrl = extractMeta(html, 'og:video:secure_url') || extractMeta(html, 'og:video');
    const posterUrl = extractMeta(html, 'og:image');

    if (!videoUrl) {
      return new Response(JSON.stringify({ error: 'No video found at that URL (private post, or not a video)' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ videoUrl, posterUrl }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
