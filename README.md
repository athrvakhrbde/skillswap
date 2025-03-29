# SkillSwap

SkillSwap is a modern web application that connects people who want to teach and learn from each other. Share your expertise and discover new skills in your community.

![SkillSwap Screenshot](screenshot.png)

## Features

- Create profiles to showcase skills you can teach and skills you want to learn
- Browse through community members to find skill-sharing matches
- Search by skills or location to find relevant skill-swap partners
- Connect with members through direct contact
- Modern, responsive UI with glassmorphism design

## Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS with custom glassmorphism effects
- **State Management**: React Context and Hooks
- **Storage**: Client-side storage with Dualite

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/skillswap.git
   cd skillswap
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Run the development server
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application

### Production Build

To create a production build:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

## Project Structure

- `/src/app` - Next.js app router pages
- `/src/components` - React components
- `/src/lib` - Utilities and database functionality
- `/public` - Static assets

## Deployment

This application can be deployed to any platform that supports Next.js, such as Vercel or Netlify.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 