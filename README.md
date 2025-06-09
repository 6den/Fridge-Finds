Recipe Search App

A web application for searching recipes using the Spoonacular API.

## Getting Started

1. Clone the repository:
   ```bash
   git clone [your-repository-url]
   cd [your-project-name]
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

## API Key Setup - Two Options

### Option 1: Environment Variable (Recommended for Development)
1. Create a `.env.local` file in the root directory
2. Add your Spoonacular API key:
   ```
   SPOONACULAR_API_KEY=your_api_key_here
   ```

### Option 2: User Settings
1. Click the settings icon (⚙️) in the bottom right corner
2. Enter your Spoonacular API key in the settings modal
3. Your key will be saved locally

## Deploy on Vercel

1. Fork or clone this repository
2. Deploy to Vercel using the [Vercel CLI](https://vercel.com/cli) or connect your GitHub repository
3. Add your environment variable:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add `SPOONACULAR_API_KEY` with your API key

## Getting a Spoonacular API Key

1. Sign up at [Spoonacular's API Portal](https://spoonacular.com/food-api)
2. Navigate to your profile
3. Copy your API key

## Technologies Used

- Next.js 14
- React 18
- Tailwind CSS
- Spoonacular API