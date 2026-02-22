# AdSense Policy Fix – "Low value content" & "Ads without publisher-content"

## Timeout when running from Cursor Agent

File operations in this project can hit **Operation timed out** when run by the agent (sandbox limits). To avoid that, run the fix **in your own terminal** (Cursor Terminal or macOS Terminal).

**One command (fix + deploy):**
```bash
cd "/Users/ronellbradley/Desktop/ABA Mastery"
node fix-adsense-files.js --deploy
```

**Fix only (no deploy):**
```bash
node fix-adsense-files.js
```

---

Google is flagging:
1. **Ads on screens without real content** – e.g. login, signup, redirect, billing.
2. **Low value content** – site needs to show ads only where there is substantial content.

## Fix: Show ads only on content-rich pages

**Remove AdSense from these pages (delete the meta tag and script block in `<head>`):**

- **index.html** – Redirect only, no content.
- **login.html** – Form only, minimal content.
- **signup.html** – Form only, minimal content.
- **billing.html** – Transactional page.

**Keep AdSense on these pages only:**

- **landing.html** – Full marketing/content page.
- **app.html** – Main study app with lots of content.

## What to remove on each thin-content page

In **index.html**, **login.html**, **signup.html**, and **billing.html**, remove:

1. This meta tag:
   ```html
   <meta name="google-adsense-account" content="ca-pub-3565666509316178">
   ```

2. This block:
   ```html
   <!-- Google AdSense -->
   <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3565666509316178" crossorigin="anonymous"></script>
   ```

## Optional: Reduce ad units on app.html

To avoid "ads near navigation," you can remove the **top banner** ad (the one directly under the header) and keep only:
- The in-content ad on the home view.
- The footer banner.

Search for `ads-banner-top` or the first `<ins class="adsbygoogle"` block after the header and remove that entire ad container (the `<div>` and its `<ins>` + `<script>`).

## After editing

1. Deploy to Vercel: `vercel --prod --yes`
2. In AdSense: **Sites** → your site → **Request review**.

## Content tips for approval

- Ensure **landing.html** and **app.html** have clear, unique text (features, study content, value proposition).
- Add or expand an About/Privacy/Contact page if the site feels thin.
- Avoid placing ads on error pages, empty states, or pure navigation/redirect screens.
