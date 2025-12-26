## Firebase Hosting deploy via GitHub Actions

This repo includes a GitHub Actions workflow at:

- `.github/workflows/firebase-hosting-deploy.yml`

Last updated: 2025-12-26

### What it does

- **On pull requests**: deploys to a **preview channel** (`pr-<number>`) that expires in 7 days.
- **On push to `main`**: deploys to the **live** Hosting channel.

### Required GitHub secret

Add this repository secret:

- **Name**: `FIREBASE_SERVICE_ACCOUNT_ABA_MASTERY_APP`
- **Value**: the full JSON of a Firebase service account key for project `aba-mastery-app`

How to get it:

1. Firebase Console → Project Settings → **Service accounts**
2. Click **Generate new private key**
3. Copy the JSON contents into the GitHub secret value

### Notes

- Do **not** commit the service account JSON to the repo.
- The workflow deploys **Hosting only** (it does not deploy Firestore/Storage rules).

