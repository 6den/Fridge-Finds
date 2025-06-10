# FridgeFinds 

FridgeFinds is an intuitive recipe discovery application that helps you cook delicious meals with ingredients you already have. Stop wondering what to cook - simply input your available ingredients and let FridgeFinds suggest personalized recipes!

##  Features

- **Ingredient-Based Search**: Find recipes based on ingredients you have at home
- **Smart Filtering**: Filter recipes by dietary preferences (vegetarian, vegan, gluten-free, dairy-free)
- **Quick Add**: Common ingredients shortcuts for faster input
- **Recipe Details**: View cooking time, servings, and detailed instructions
- **Favorites System**: Save your favorite recipes for quick access
- **Responsive Design**: Works seamlessly on desktop and mobile devices

##  Built With

- **Next.js 14** - React framework for production
- **React 18** - UI components and hooks
- **Tailwind CSS** - Styling and responsive design
- **Spoonacular API** - Recipe data and search functionality
- **Vercel** - Deployment and hosting

##  Getting Started

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

##  API Key Setup

### Option 1: Environment Variable (Recommended for Development)
1. Create a `.env.local` file in the root directory
2. Add your Spoonacular API key:
   ```
   SPOONACULAR_API_KEY=your_api_key_here
   ```

### Option 2: User Settings
1. Click the settings icon in the bottom right corner
2. Enter your Spoonacular API key in the settings modal
3. Your key will be saved locally

To get a Spoonacular API key:
1. Sign up at [Spoonacular's API Portal](https://spoonacular.com/food-api)
2. Navigate to your profile
3. Copy your API key

##  Usage

1. Enter ingredients you have in your kitchen
2. Use quick-add buttons for common ingredients
3. Set any dietary preferences
4. Click "Find Recipes" to get personalized recipe suggestions
5. Save your favorite recipes for future reference
6. Click on any recipe to view detailed instructions

##  Deployment

To deploy on Vercel:
1. Fork or clone this repository
2. Deploy using the [Vercel CLI](https://vercel.com/cli) or connect your GitHub repository
3. Add your environment variable:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add `SPOONACULAR_API_KEY` with your API key

##  Contributing

Contributions are welcome! Feel free to open issues and submit pull requests.

##  License

This project is open source and available under the [MIT License](LICENSE).