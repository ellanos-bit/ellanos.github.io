function generateMealPlan() {
    // Get user inputs
    var dietaryRestrictions = document.getElementById("dietary-restrictions").value;
    var calorieGoals = document.getElementById("calorie-goals").value;
    var preferredCuisines = document.getElementById("preferred-cuisines").value;

    // Validate user inputs
    if (calorieGoals === "" || isNaN(calorieGoals)) {
        alert("Please enter a valid calorie goal.");
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
                // Check dietary restrictions
                if (dietaryRestrictions !== "" && !meal.dietaryRestrictions.includes(dietaryRestrictions)) {
                    return false;
                }

                // Check calorie goals
                if (calorieGoals !== "" && meal.calorieGoals > calorieGoals) {
                    return false;
                }

                // Check preferred cuisines
                if (preferredCuisines !== "" && !meal.preferredCuisines.includes(preferredCuisines)) {
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
            var mealPlan = [];
            var days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
            for (var i = 0; i < days.length; i++) {
                // Get a random meal from the filtered meals
                var randomMeal = filteredMeals[Math.floor(Math.random() * filteredMeals.length)];

                // Add the meal to the meal plan
                mealPlan.push({
                    day: days[i],
                    meal: randomMeal.name
                });
            }

            // Display the meal plan
            var mealPlanHtml = "<h2>Your Meal Plan</h2><ul>";
            for (var i = 0; i < mealPlan.length; i++) {
                mealPlanHtml += "<li>" + mealPlan[i].day + ": " + mealPlan[i].meal + "</li>";
            }
            mealPlanHtml += "</ul>";

            // Add the meal plan to the page
            document.getElementById("meal-plan-input").innerHTML += mealPlanHtml;
        })
        .catch(error => {
            console.error("Error:", error);
            alert("An error occurred while generating your meal plan. Please try again later.");
        });
}