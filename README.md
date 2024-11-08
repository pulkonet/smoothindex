# SmoothIndex - Google Search Console Dashboard

A modern dashboard for managing and monitoring your Google Search Console sites with instant indexing capabilities.

## Deployment Guide for Vercel

### Prerequisites

1. A Google Cloud Project with:
   - Search Console API enabled
   - OAuth 2.0 credentials configured
   - Verified ownership of sites in Google Search Console

2. A [Vercel](https://vercel.com) account
3. [Vercel CLI](https://vercel.com/cli) installed (optional)

### Step 1: Prepare Your Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Google Search Console API
   - Google OAuth2 API
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth Client ID"
   - Choose "Web application"
   - Add authorized redirect URIs:
     ```
     https://your-domain.vercel.app/api/auth/google
     http://localhost:3000/api/auth/google (for development)
     ```
   - Save your Client ID and Client Secret

### Step 2: Deploy to Vercel

#### Option 1: Deploy via Vercel Dashboard

1. Push your code to a GitHub repository

2. Go to [Vercel Dashboard](https://vercel.com/dashboard)

3. Click "New Project"

4. Import your GitHub repository

5. Configure the project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `next build`
   - Install Command: `npm install`
   - Output Directory: .next

6. Add Environment Variables:
   ```
   GOOGLE_CLIENT_ID=your_client_id_here
   GOOGLE_CLIENT_SECRET=your_client_secret_here
   GOOGLE_REDIRECT_URI=https://your-domain.vercel.app/api/auth/google
   ```

7. Click "Deploy"

#### Option 2: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy the project:
   ```bash
   vercel
   ```

4. Add environment variables:
   ```bash
   vercel env add GOOGLE_CLIENT_ID
   vercel env add GOOGLE_CLIENT_SECRET
   vercel env add GOOGLE_REDIRECT_URI
   ```

### Step 3: Post-Deployment Configuration

1. Update Google Cloud Console OAuth settings:
   - Add your production redirect URI:
     ```
     https://your-domain.vercel.app/api/auth/google
     ```

2. Configure your production environment variables in Vercel:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Update `GOOGLE_REDIRECT_URI` to match your production URL

3. Verify deployment:
   - Visit your deployed site
   - Test the Google login flow
   - Verify Search Console data is loading correctly

### Development

To run locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/smoothindex.git
   cd smoothindex
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env.local`:
   ```
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

### Troubleshooting

1. **OAuth Error**: Verify your redirect URIs match exactly in both Vercel env vars and Google Cloud Console

2. **API Errors**: Check that all required APIs are enabled in Google Cloud Console

3. **Deployment Errors**: Check Vercel build logs and ensure all environment variables are set correctly

### Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Google Search Console API](https://developers.google.com/webmaster-tools/search-console-api-original)

### Support

For issues and feature requests, please use the GitHub Issues section.

### License

MIT License - feel free to use this project for your own purposes.
