# Interior Dezign Studio OS

The studio's web app: leads, clients, Quick BOQ, item catalog, BOQ estimates, GST bills, payments and team access.

The whole app is one file, `index.html`. It is hosted free on GitHub Pages, and all studio data is saved in **your own Google Drive**. Nothing is stored on GitHub.

## 1. Turn on the website (one time)

1. In this repository, open **Settings → General**. At the bottom, under **Danger Zone**, choose **Change visibility → Public**.
2. Open **Settings → Pages**.
   - **Source:** Deploy from a branch
   - **Branch:** `main`, folder `/ (root)`, then press **Save**.
3. After about a minute, the page shows your web address:
   `https://interiordezignstudio-ai.github.io/web-app/`

## 2. Connect Google Drive (one time)

The app needs a free Google "Client ID" so it can save to your Drive.

1. Go to <https://console.cloud.google.com/> and sign in with the studio Google account.
2. Create a project, e.g. "Interior Dezign Studio OS".
3. **APIs & Services → Library:** enable **Google Drive API**.
   - Optional: also enable **Google Sheets API** (for importing leads from a sheet) and **Google Calendar API** (for adding site visits to your calendar).
4. **APIs & Services → OAuth consent screen** (also called **Google Auth Platform**):
   - **User type:** External
   - **App name:** Interior Dezign Studio OS
   - **Support email:** your email
   - **Test users:** add the Google account of every staff member who will use the app.
5. **APIs & Services → Credentials → Create credentials → OAuth client ID**:
   - **Application type:** Web application
   - **Authorised JavaScript origins:** `https://interiordezignstudio-ai.github.io`
   - Press **Create** and copy the **Client ID** (it ends in `.apps.googleusercontent.com`).
6. Open the app at your web address, then go to **Sync & Backup → Google Drive**. Paste the Client ID and press **Connect / Sign in with Google**.

The app creates a folder **"Interior Dezign Studio OS"** in that Drive, with one data file. Every device that signs in with an allowed Google account works on the same data.

## Updating the app

Replace `index.html` with the new version and commit it. GitHub Pages updates the website within a minute or two. Your data in Google Drive is not affected.
