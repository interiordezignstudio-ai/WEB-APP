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
   - **Test users:** add the studio Google account (the one that will hold the data).
5. **APIs & Services → Credentials → Create credentials → OAuth client ID**:
   - **Application type:** Web application
   - **Authorised JavaScript origins:** `https://interiordezignstudio-ai.github.io`
   - Press **Create** and copy the **Client ID** (it ends in `.apps.googleusercontent.com`).
6. The studio's Client ID is already built into `index.html`. On each phone or computer, open the app at your web address, go to **Sync & Backup → Google Drive** and press **Connect Google Drive**. (If you ever make a new Client ID, put it in `DEFAULT_GOOGLE_CLIENT_ID` in `index.html`.)

The app creates a folder **"Interior Dezign Studio OS"** in that Drive, with one data file.

**Important:** on every phone and computer, sign in to Google Drive with the **same studio Google account**. If someone signs in with a different Google account, they get a separate, empty copy of the data. Inside the app, each staff member picks their own name (Team & Roles), and a PIN keeps others out of their account.

## Updating the app

Replace `index.html` with the new version and commit it. GitHub Pages updates the website within a minute or two. Your data in Google Drive is not affected.
