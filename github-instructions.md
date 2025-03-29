# GitHub Repository Setup Instructions

Follow these steps to push your SkillSwap project to GitHub:

## 1. Create a new repository on GitHub

1. Go to https://github.com/new
2. Repository name: skillswap
3. Description: A peer-to-peer skill-sharing platform
4. Choose Public or Private
5. Do NOT initialize with README, .gitignore, or license
6. Click "Create repository"

## 2. Push your code to GitHub

### Option 1: Using HTTPS (recommended for most users)

```bash
# Configure your GitHub username and email if you haven't already
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"

# Add the remote repository
git remote add origin https://github.com/YOUR-USERNAME/skillswap.git

# Push your code
git push -u origin main
```

### Option 2: Using SSH (if you have SSH keys set up)

```bash
# Add the remote repository
git remote add origin git@github.com:YOUR-USERNAME/skillswap.git

# Push your code
git push -u origin main
```

### Option 3: Using GitHub CLI (if installed)

```bash
# Login to GitHub
gh auth login

# Create the repository
gh repo create skillswap --private --source=. --push
```

## 3. Verify your repository

After pushing, visit your GitHub repository at:
https://github.com/YOUR-USERNAME/skillswap

You should see all your files uploaded there.

## 4. Deploy to Vercel (optional)

For easy deployment:
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Click "Deploy" 