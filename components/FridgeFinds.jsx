import React, { useState } from 'react';
import { Search, Plus, X, Heart, Clock, Users, ChefHat } from 'lucide-react';

const FridgeFinds = () => {
    const [ingredients, setIngredients] = useState([]);
    const [currentIngredient, setCurrentIngredient] = useState('');
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [error, setError] = useState('');
    const [dietaryFilters, setDietaryFilters] = useState({
        vegetarian: false,
        vegan: false,
        glutenFree: false,
        dairyFree: false
    });

    const addIngredient = () => {
        if (currentIngredient.trim() && !ingredients.includes(currentIngredient.trim())) {
            setIngredients([...ingredients, currentIngredient.trim()]);
            setCurrentIngredient('');
        }
    };

    const removeIngredient = (ingredient) => {
        setIngredients(ingredients.filter(ing => ing !== ingredient));
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            addIngredient();
        }
    };

    const toggleFavorite = (recipe) => {
        const isFavorite = favorites.some(fav => fav.id === recipe.id);
        if (isFavorite) {
            setFavorites(favorites.filter(fav => fav.id !== recipe.id));
        } else {
            setFavorites([...favorites, recipe]);
        }
    };

    const searchRecipes = async () => {
        if (ingredients.length === 0) return;

        setLoading(true);
        setError('');

        try {
            const ingredientsQuery = ingredients.join(',');
            const activeDietaryFilters = Object.entries(dietaryFilters)
                .filter(([key, value]) => value)
                .map(([key, value]) => key);

            const dietaryQuery = activeDietaryFilters.length > 0
                ? `&dietary=${activeDietaryFilters.join(',')}`
                : '';

            const response = await fetch(`/api/recipes/search?ingredients=${ingredientsQuery}${dietaryQuery}`);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch recipes');
            }

            const data = await response.json();
            setRecipes(data);

            if (data.length === 0) {
                setError('No recipes found with your current ingredients and dietary preferences. Try removing some filters or adding more ingredients.');
            }
        } catch (error) {
            console.error('Error fetching recipes:', error);
            setError(`Failed to fetch recipes: ${error.message}`);
            setRecipes([]);
        }
        setLoading(false);
    };

    const commonIngredients = [
        'chicken', 'beef', 'pork', 'fish', 'eggs', 'milk', 'cheese', 'butter',
        'onions', 'garlic', 'tomatoes', 'potatoes', 'carrots', 'broccoli',
        'rice', 'pasta', 'bread', 'flour', 'olive oil', 'salt', 'pepper'
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center mb-4">
                        <ChefHat className="w-12 h-12 text-green-600 mr-3" />
                        <h1 className="text-4xl font-bold text-gray-800">FridgeFinds</h1>
                    </div>
                    <p className="text-xl text-gray-600">Discover amazing recipes with ingredients you already have!</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                {/* Ingredient Input Section */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">What's in your fridge?</h2>

                    <div className="flex gap-2 mb-4">
                        <input
                            type="text"
                            value={currentIngredient}
                            onChange={(e) => setCurrentIngredient(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Enter an ingredient..."
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <button
                            onClick={addIngredient}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add
                        </button>
                    </div>

                    {/* Common Ingredients */}
                    <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">Quick add common ingredients:</p>
                        <div className="flex flex-wrap gap-2">
                            {commonIngredients.slice(0, 10).map(ingredient => (
                                <button
                                    key={ingredient}
                                    onClick={() => {
                                        if (!ingredients.includes(ingredient)) {
                                            setIngredients([...ingredients, ingredient]);
                                        }
                                    }}
                                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50"
                                    disabled={ingredients.includes(ingredient)}
                                >
                                    {ingredient}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Selected Ingredients */}
                    {ingredients.length > 0 && (
                        <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">Your ingredients:</p>
                            <div className="flex flex-wrap gap-2">
                                {ingredients.map(ingredient => (
                                    <span key={ingredient} className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full">
                    {ingredient}
                                        <button onClick={() => removeIngredient(ingredient)}>
                      <X className="w-4 h-4 hover:text-red-600" />
                    </button>
                  </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Dietary Filters */}
                    <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Dietary preferences:</p>
                        <div className="flex flex-wrap gap-4">
                            {Object.entries(dietaryFilters).map(([key, value]) => (
                                <label key={key} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={value}
                                        onChange={(e) => setDietaryFilters({...dietaryFilters, [key]: e.target.checked})}
                                        className="rounded"
                                    />
                                    <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Search Button */}
                    <button
                        onClick={searchRecipes}
                        disabled={ingredients.length === 0 || loading}
                        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center gap-2 font-medium"
                    >
                        <Search className="w-5 h-5" />
                        {loading ? 'Searching...' : 'Find Recipes'}
                    </button>
                </div>

                {/* Recipe Results */}
                {recipes.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {recipes.map(recipe => (
                            <div key={recipe.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                                <img
                                    src={recipe.image || "https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=300&h=200&fit=crop"}
                                    alt={recipe.title}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{recipe.title}</h3>
                                        <button
                                            onClick={() => toggleFavorite(recipe)}
                                            className={`p-1 ${favorites.some(fav => fav.id === recipe.id) ? 'text-red-500' : 'text-gray-400'} hover:text-red-500`}
                                        >
                                            <Heart className="w-5 h-5" fill={favorites.some(fav => fav.id === recipe.id) ? 'currentColor' : 'none'} />
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            {recipe.readyInMinutes || 30} min
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Users className="w-4 h-4" />
                                            {recipe.servings || 4} servings
                                        </div>
                                    </div>

                                    {/* Dietary badges */}
                                    <div className="flex flex-wrap gap-1 mb-3">
                                        {recipe.vegetarian && <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Vegetarian</span>}
                                        {recipe.vegan && <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Vegan</span>}
                                        {recipe.glutenFree && <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">Gluten Free</span>}
                                        {recipe.dairyFree && <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">Dairy Free</span>}
                                    </div>

                                    {/* Ingredients you have vs missing */}
                                    <div className="space-y-2">
                                        {recipe.usedIngredients && recipe.usedIngredients.length > 0 && (
                                            <div>
                                                <p className="text-xs font-medium text-green-700">✓ You have:</p>
                                                <p className="text-xs text-green-600">
                                                    {recipe.usedIngredients.map(ing => ing.name).join(', ')}
                                                </p>
                                            </div>
                                        )}
                                        {recipe.missedIngredients && recipe.missedIngredients.length > 0 && (
                                            <div>
                                                <p className="text-xs font-medium text-orange-700">Missing:</p>
                                                <p className="text-xs text-orange-600">
                                                    {recipe.missedIngredients.map(ing => ing.name).join(', ')}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => setSelectedRecipe(recipe)}
                                        className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                                    >
                                        View Recipe
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Favorites Section */}
                {favorites.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Favorites</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {favorites.map(recipe => (
                                <div key={`fav-${recipe.id}`} className="bg-white rounded-xl shadow-lg overflow-hidden">
                                    <img
                                        src={recipe.image || "https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=300&h=200&fit=crop"}
                                        alt={recipe.title}
                                        className="w-full h-32 object-cover"
                                    />
                                    <div className="p-3">
                                        <h3 className="text-sm font-semibold text-gray-800 mb-2">{recipe.title}</h3>
                                        <button
                                            onClick={() => setSelectedRecipe(recipe)}
                                            className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs font-medium"
                                        >
                                            View Recipe
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Recipe Detail Modal */}
                {selectedRecipe && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <h2 className="text-2xl font-bold text-gray-800">{selectedRecipe.title}</h2>
                                    <button
                                        onClick={() => setSelectedRecipe(null)}
                                        className="p-2 hover:bg-gray-100 rounded-full"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <img
                                    src={selectedRecipe.image || "https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=600&h=300&fit=crop"}
                                    alt={selectedRecipe.title}
                                    className="w-full h-64 object-cover rounded-lg mb-4"
                                />

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Clock className="w-5 h-5" />
                                        <span>Ready in {selectedRecipe.readyInMinutes || 30} minutes</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Users className="w-5 h-5" />
                                        <span>Serves {selectedRecipe.servings || 4}</span>
                                    </div>
                                </div>

                                {selectedRecipe.summary && (
                                    <div className="mb-4">
                                        <h3 className="text-lg font-semibold mb-2">About this recipe</h3>
                                        <div className="text-gray-700 text-sm" dangerouslySetInnerHTML={{__html: selectedRecipe.summary}} />
                                    </div>
                                )}

                                <div className="text-center">
                                    <p className="text-gray-600 mb-2">Get the full recipe and instructions:</p>
                                    <a
                                        href={selectedRecipe.sourceUrl || `https://spoonacular.com/recipes/${selectedRecipe.title.replace(/\s+/g, '-').toLowerCase()}-${selectedRecipe.id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                                    >
                                        View Full Recipe
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FridgeFinds;