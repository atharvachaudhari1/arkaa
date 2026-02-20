# Send form responses to your Google Sheet

Your sheet: [arkaa team landing](https://docs.google.com/spreadsheets/d/1RRdcV1jDcyutzmClKI4_FJ_MIxRON62v72mZGS2Lz6U/edit?usp=sharing)

## Step 1: Add the script to your sheet

1. Open the sheet above → **Extensions** → **Apps Script**.
2. Delete any default code and paste the contents of `Code.gs` (in this folder).
3. Save (Ctrl+S) and name the project e.g. "ARKAA Form to Sheet".

## Step 2: Deploy as web app

1. Click **Deploy** → **New deployment**.
2. Click the gear icon → **Web app**.
3. Set:
   - **Description:** ARKAA forms
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy**, authorize when asked, then copy the **Web app URL** (looks like `https://script.google.com/macros/s/.../exec`).

## Step 3: Add URL to the website

1. In the project root (`DeadCode/Arka_Web/`), create or edit `.env`.
2. Add:
   ```
   VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   ```
   (use the URL you copied).
3. Restart the dev server (`npm run dev`).

After this, **Work with Us** and **Get in Touch** submissions will append a new row to the first sheet.

## Sheet columns

In the first row of your sheet, add headers (optional but recommended):

| A          | B           | C      | D            | E            | F             | G        |
|-----------|-------------|--------|-------------|-------------|---------------|----------|
| Timestamp | Form Type   | Name   | Email       | Project Type | Organisation   | Message  |

- **Get in Touch:** Form Type = "Get in Touch"; Project Type & Organisation are empty.
- **Work with Us:** Form Type = "Work with Us"; all columns filled from the Hire Us modal.
