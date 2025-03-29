# SkillSwap

SkillSwap is a peer-to-peer platform that connects people who want to teach and learn from each other. Share your expertise and discover new skills in your community.

![SkillSwap Screenshot](public/og-image.png)

## Features

- **Profile Creation**: Create a profile showcasing your teachable skills and what you want to learn
- **Browse Profiles**: Find people with complementary skills in your community
- **Real-time Chat**: Connect directly with potential skill swap partners
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **State Management**: React Hooks
- **Data Persistence**: Local storage (development), API-ready for production integration
- **Deployment**: Netlify Static Export

## Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/your-username/skillswap.git
cd skillswap
```

2. Install dependencies

```bash
npm install
# or
yarn
```

3. Set up environment variables

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_ENABLE_CHAT=true
```

4. Run the development server

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Production Deployment

### Building for production

```bash
npm run build
# or
yarn build
```

### Running in production mode

```bash
npm run start
# or
yarn start
```

### Deploying to Netlify

This project is configured for deployment on Netlify. The `netlify.toml` file includes the necessary configuration for deployment with static export.

1. Push your changes to GitHub
2. Connect your repository to Netlify
3. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `out`

## API Integration

The application is designed to work with a backend API. In development mode, it uses local storage as a fallback. To connect to your API:

1. Set the `NEXT_PUBLIC_API_URL` environment variable to your API endpoint
2. Ensure your API implements the following endpoints:
   - `GET /profiles` - Returns a list of all profiles
   - `POST /profiles` - Creates a new profile

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Icons](https://react-icons.github.io/react-icons/)
- [Cursor UI](https://cursor.com) - UI design inspiration 