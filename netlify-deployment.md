# Deploying SkillSwap to Netlify

This guide will walk you through deploying your SkillSwap application to Netlify.

## Prerequisites

- A GitHub repository with your SkillSwap code
- A Netlify account (sign up at [netlify.com](https://www.netlify.com/) if you don't have one)

## Deployment Steps

### 1. Push Your Code to GitHub

Before deploying to Netlify, make sure your code is pushed to GitHub:

```bash
git add .
git commit -m "Prepare for Netlify deployment"
git push -u origin main
```

### 2. Connect to Netlify

1. Log in to your Netlify account
2. Click "Add new site" → "Import an existing project"
3. Choose "GitHub" as your Git provider
4. Authenticate with GitHub if prompted
5. Select your SkillSwap repository

### 3. Configure Build Settings

Netlify should automatically detect that this is a Next.js project, but ensure these settings:

- **Build command**: `npm run build`
- **Publish directory**: `.next`

The `netlify.toml` file in your repository should handle these settings automatically.

### 4. Advanced Settings (Optional)

You can configure additional settings:

- **Environment variables**: Add any environment variables your app needs
- **Domain settings**: Set up a custom domain for your application
- **Build hooks**: Configure automatic deployments when you push to GitHub

### 5. Deploy

Click "Deploy site" and wait for the build to complete. Netlify will provide you with a URL where your site is hosted (e.g., `https://skillswap-yourname.netlify.app`).

## Post-Deployment

After deployment, you can:

- Set up a custom domain
- Enable HTTPS
- Configure form handling
- Set up redirects and rewrites
- Monitor site analytics

## Troubleshooting

If you encounter any issues with your deployment:

1. Check the build logs in Netlify for errors
2. Ensure the `@netlify/plugin-nextjs` package is installed
3. Verify your `netlify.toml` configuration is correct
4. Test your build locally with `npm run build` to ensure it compiles correctly

## Local Testing

To test the Netlify build process locally before deploying:

1. Install the Netlify CLI: `npm install -g netlify-cli`
2. Run `netlify build` to test the build process
3. Run `netlify dev` to test your site locally with Netlify's environment

## Automatic Deployments

Netlify will automatically rebuild and deploy your site when you push changes to your GitHub repository. No additional configuration is required for this feature. 