// pages/api/recipes/search.js
export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { ingredients, dietary } = req.query;

    if (!ingredients) {
        return res.status(400).json({ error: 'Ingredients parameter is required' });
    }

    const apiKey = process.env.SPOONACULAR_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'API key not configured' });
    }

    try {
        // First API call to get recipes by ingredients
        const searchUrl = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=12&apiKey=${apiKey}`;
        const searchResponse = await fetch(searchUrl);

        if (!searchResponse.ok) {
            throw new Error(`Spoonacular API error: ${searchResponse.status}`);
        }

        const recipes = await searchResponse.json();

        // Get detailed information for each recipe
        const detailedRecipes = await Promise.all(
            recipes.map(async (recipe) => {
                try {
                    const detailUrl = `https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=${apiKey}`;
                    const detailResponse = await fetch(detailUrl);

                    if (!detailResponse.ok) {
                        console.warn(`Failed to get details for recipe ${recipe.id}`);
                        return recipe; // Return basic recipe if detailed info fails
                    }

                    const detailData = await detailResponse.json();
                    return { ...recipe, ...detailData };
                } catch (error) {
                    console.warn(`Error getting details for recipe ${recipe.id}:`, error);
                    return recipe; // Return basic recipe if detailed info fails
                }
            })
        );

        // Apply dietary filters if provided
        let filteredRecipes = detailedRecipes;
        if (dietary) {
            const dietaryFilters = dietary.split(',');
            filteredRecipes = detailedRecipes.filter(recipe => {
                return dietaryFilters.every(filter => {
                    switch (filter) {
                        case 'vegetarian':
                            return recipe.vegetarian === true;
                        case 'vegan':
                            return recipe.vegan === true;
                        case 'glutenFree':
                            return recipe.glutenFree === true;
                        case 'dairyFree':
                            return recipe.dairyFree === true;
                        default:
                            return true;
                    }
                });
            });
        }

        res.status(200).json(filteredRecipes);
    } catch (error) {
        console.error('Recipe search error:', error);
        res.status(500).json({
            error: 'Failed to fetch recipes',
            details: error.message
        });
    }
}