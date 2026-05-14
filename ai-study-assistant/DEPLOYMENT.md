# Vercel Deployment Checklist

## Environment Variables to Add in Vercel Dashboard

After importing your repository in Vercel, go to **Settings > Environment Variables** and add the following:

### Required Environment Variables

- **VITE_GEMINI_API_KEY**
  - Description: Your Google Gemini API key for AI functionality
  - How to get: Visit https://aistudio.google.com/app/apikey
  - Type: String
  - Environment: Production, Preview, Development (all environments)

## Deployment Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import in Vercel**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Vercel will automatically detect it as a Vite project

3. **Add Environment Variables**
   - Go to Project Settings > Environment Variables
   - Add `VITE_GEMINI_API_KEY` with your actual API key
   - Select all environments (Production, Preview, Development)

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your app
   - The `vercel.json` file ensures SPA routing works correctly

## Post-Deployment Verification

After deployment, verify:
- [ ] Landing page loads at the root URL
- [ ] Navigation to `/chat` works
- [ ] API connection test passes (no error banner)
- [ ] Chat functionality works with actual API
- [ ] Mobile responsiveness is maintained
- [ ] All three modes (Explain, Quiz, Summary) function correctly

## Troubleshooting

### API Key Errors
If you see "API Key tidak valid" error:
- Verify the environment variable is set in Vercel dashboard
- Ensure the variable name is exactly `VITE_GEMINI_API_KEY` (case-sensitive)
- Check that your API key is valid at https://aistudio.google.com/app/apikey

### Quota Errors
If you see "Quota Gemini habis" error:
- Your Gemini API quota has been exceeded
- Check your usage at Google AI Studio
- Consider upgrading your plan or waiting for quota reset

### Routing Issues
If routes don't work:
- Ensure `vercel.json` is in the project root
- The file should contain the SPA rewrite rule
- Redeploy if you added `vercel.json` after initial deployment
