<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/14Hku_dmY2-p6PnmQTBJqrnO0Xu9NbWfD

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

   > **Note for Windows Users:** If you see an error about "execution policies" (PSSecurityException), run this command in PowerShell to allow script execution:
   > ```powershell
   > Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
   > ```

## Deployment

This project is configured with a GitHub Action for automated building and testing.

### GitHub Actions
The workflow is defined in `.github/workflows/deploy.yml`. It runs on every push to the `main` branch and:
1. Installs dependencies.
2. Builds the project to verify there are no errors.

To deploy to a specific environment (e.g., GitHub Pages, Vercel, Netlify), update the workflow file with the specific deployment steps for your provider.
