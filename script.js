function generateMealPlan() {
    // Get user inputs
    var dietaryPreferences = document.getElementById("dietary-preferences").value;
    var calorieGoals = document.getElementById("calorie-goals").value;

    // Validate user inputs
    if (calorieGoals === "") {
        alert("Please select a calorie goal.");
        return;
    }

    // Fetch meal data from meals.json
    fetch("meals.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch meal data.");
            }
            return response.json();
        })
        .then(meals => {
            // Filter meals based on user preferences
            var filteredMeals = meals.filter(meal => {
                // Check dietary preferences
                if (dietaryPreferences !== "" && !meal.dietaryRestrictions.includes(dietaryPreferences)) {
                    return false;
                }

                // Check calorie goals
                if (calorieGoals !== "" && meal.calorieGoals == calorieGoals) {
                    return false;
                }

                return true;
            });

            // Check if there are any meals that match the user's criteria
            if (filteredMeals.length === 0) {
                alert("No meals found matching your criteria. Please adjust your preferences.");
                return;
            }

            // Generate meal plan
            var mealPlan = {};
            var days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
            var mealTypes = ["breakfast", "lunch", "dinner"];

            days.forEach(day => {
                mealPlan[day] = {};
                mealTypes.forEach(mealType => {
                    // Get a random meal from the filtered meals
                    var randomMeal = filteredMeals[Math.floor(Math.random() * filteredMeals.length)];

                    // Add the meal to the meal plan
                    mealPlan[day][mealType] = {
                        name: randomMeal.name,
                        ingredients: randomMeal.ingredients[mealType]
                    };
                });
            });

            // Display the meal plan
            var mealPlanHtml = "<h2>Your Meal Plan</h2>";
            days.forEach(day => {
                mealPlanHtml += "<h3>" + day + "</h3><ul>";
                mealTypes.forEach(mealType => {
                    mealPlanHtml += "<li><b>" + mealType + ":</b> " + mealPlan[day][mealType].name + "<br>";
                    mealPlanHtml += "<b>Ingredients:</b> " + mealPlan[day][mealType].ingredients.join(", ") + "</li>";
                });
                mealPlanHtml += "</ul>";
            });

            // Add the meal plan to the page
            document.getElementById("meal-plan-input").innerHTML += mealPlanHtml;
        })
        .catch(error => {
            console.error("Error:", error);
            alert("An error occurred while generating your meal plan. Please try again later.");
        });
}