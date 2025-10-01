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
        <div className="min-h-screen bg-[#FBF7F4]">
            <div className="container mx-auto px-4 py-12 md:py-16">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="flex items-center justify-center mb-6">
                        <ChefHat className="w-14 h-14 text-[#FF6B35] mr-3" />
                        <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight">FridgeFinds</h1>
                    </div>
                    <p className="text-xl md:text-2xl text-gray-700 font-medium">Discover amazing recipes with ingredients you already have!</p>
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
                        <div className="mb-6">
                            <p className="text-sm font-semibold text-gray-700 mb-3">Your ingredients:</p>
                            <div className="flex flex-wrap gap-2">
                                {ingredients.map(ingredient => (
                                    <span key={ingredient} className="flex items-center gap-2 px-4 py-2 bg-[#FF6B35] bg-opacity-10 text-[#FF6B35] rounded-full font-medium">
                    {ingredient}
                                        <button onClick={() => removeIngredient(ingredient)}>
                      <X className="w-4 h-4 hover:text-red-600 transition-colors" />
                    </button>
                  </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Dietary Filters */}
                    <div className="mb-6">
                        <p className="text-sm font-semibold text-gray-700 mb-3">Dietary preferences:</p>
                        <div className="flex flex-wrap gap-4">
                            {Object.entries(dietaryFilters).map(([key, value]) => (
                                <label key={key} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={value}
                                        onChange={(e) => setDietaryFilters({...dietaryFilters, [key]: e.target.checked})}
                                        className="rounded w-4 h-4 text-[#FF6B35] focus:ring-[#FF6B35] border-gray-300"
                                    />
                                    <span className="text-sm font-medium capitalize text-gray-700">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Search Button */}
                    <button
                        onClick={searchRecipes}
                        disabled={ingredients.length === 0 || loading}
                        className="w-full px-6 py-4 bg-gray-900 text-white rounded-2xl hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500 flex items-center justify-center gap-2 font-bold text-lg shadow-md transition-all"
                    >
                        <Search className="w-5 h-5" />
                        {loading ? 'Searching...' : 'Find Recipes'}
                    </button>
                </div>

                {/* Recipe Results */}
                {recipes.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {recipes.map(recipe => (
                            <div key={recipe.id} className="bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1">
                                <img
                                    src={recipe.image || "https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=300&h=200&fit=crop"}
                                    alt={recipe.title}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-5">
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{recipe.title}</h3>
                                        <button
                                            onClick={() => toggleFavorite(recipe)}
                                            className={`p-1 ${favorites.some(fav => fav.id === recipe.id) ? 'text-[#FF6B35]' : 'text-gray-300'} hover:text-[#FF6B35] transition-colors`}
                                        >
                                            <Heart className="w-5 h-5" fill={favorites.some(fav => fav.id === recipe.id) ? 'currentColor' : 'none'} />
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-4 h-4" />
                                            <span className="font-medium">{recipe.readyInMinutes || 30} min</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Users className="w-4 h-4" />
                                            <span className="font-medium">{recipe.servings || 4} servings</span>
                                        </div>
                                    </div>

                                    {/* Dietary badges */}
                                    <div className="flex flex-wrap gap-1.5 mb-4">
                                        {recipe.vegetarian && <span className="px-2.5 py-1 text-xs bg-green-50 text-green-700 rounded-full font-semibold">Vegetarian</span>}
                                        {recipe.vegan && <span className="px-2.5 py-1 text-xs bg-green-50 text-green-700 rounded-full font-semibold">Vegan</span>}
                                        {recipe.glutenFree && <span className="px-2.5 py-1 text-xs bg-blue-50 text-blue-700 rounded-full font-semibold">Gluten Free</span>}
                                        {recipe.dairyFree && <span className="px-2.5 py-1 text-xs bg-amber-50 text-amber-700 rounded-full font-semibold">Dairy Free</span>}
                                    </div>

                                    {/* Ingredients you have vs missing */}
                                    <div className="space-y-2 mb-4">
                                        {recipe.usedIngredients && recipe.usedIngredients.length > 0 && (
                                            <div>
                                                <p className="text-xs font-bold text-green-700">✓ You have:</p>
                                                <p className="text-xs text-green-600 font-medium">
                                                    {recipe.usedIngredients.map(ing => ing.name).join(', ')}
                                                </p>
                                            </div>
                                        )}
                                        {recipe.missedIngredients && recipe.missedIngredients.length > 0 && (
                                            <div>
                                                <p className="text-xs font-bold text-[#FF6B35]">Missing:</p>
                                                <p className="text-xs text-gray-600 font-medium">
                                                    {recipe.missedIngredients.map(ing => ing.name).join(', ')}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => setSelectedRecipe(recipe)}
                                        className="w-full px-4 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 text-sm font-bold transition-colors"
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
                    <div className="mt-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">Your Favorites</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {favorites.map(recipe => (
                                <div key={`fav-${recipe.id}`} className="bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1">
                                    <img
                                        src={recipe.image || "https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=300&h=200&fit=crop"}
                                        alt={recipe.title}
                                        className="w-full h-32 object-cover"
                                    />
                                    <div className="p-4">
                                        <h3 className="text-sm font-bold text-gray-900 mb-3">{recipe.title}</h3>
                                        <button
                                            onClick={() => setSelectedRecipe(recipe)}
                                            className="w-full px-3 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 text-xs font-bold transition-colors"
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
                    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                            <div className="p-8">
                                <div className="flex items-start justify-between mb-6">
                                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">{selectedRecipe.title}</h2>
                                    <button
                                        onClick={() => setSelectedRecipe(null)}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <img
                                    src={selectedRecipe.image || "https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=600&h=300&fit=crop"}
                                    alt={selectedRecipe.title}
                                    className="w-full h-64 object-cover rounded-2xl mb-6"
                                />

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <Clock className="w-5 h-5" />
                                        <span className="font-semibold">Ready in {selectedRecipe.readyInMinutes || 30} minutes</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <Users className="w-5 h-5" />
                                        <span className="font-semibold">Serves {selectedRecipe.servings || 4}</span>
                                    </div>
                                </div>

                                {selectedRecipe.summary && (
                                    <div className="mb-6">
                                        <h3 className="text-xl font-bold mb-3 text-gray-900">About this recipe</h3>
                                        <div className="text-gray-700 text-sm leading-relaxed" dangerouslySetInnerHTML={{__html: selectedRecipe.summary}} />
                                    </div>
                                )}

                                <div className="text-center">
                                    <p className="text-gray-700 mb-4 font-medium">Get the full recipe and instructions:</p>
                                    <a
                                        href={selectedRecipe.sourceUrl || `https://spoonacular.com/recipes/${selectedRecipe.title.replace(/\s+/g, '-').toLowerCase()}-${selectedRecipe.id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block px-8 py-4 bg-[#FF6B35] text-white rounded-2xl hover:bg-[#e85a28] font-bold text-lg shadow-md transition-colors"
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