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
        var dietaryRestrictionMatch = dietaryPreferences === "" || meal.dietaryRestrictions.includes(dietaryPreferences);
        var calorieGoalMatch = calorieGoals === "" || meal.calorieGoals == calorieGoals;
        return dietaryRestrictionMatch && calorieGoalMatch;
      });

      // Check if there are any meals that match the user's criteria
      if (filteredMeals.length === 0) {
        alert("No meals found matching your criteria. Please adjust your preferences.");
        document.getElementById("meal-plan-input").innerHTML = ""; // Clear previous results
        return;
      }

      // Generate meal plan
      var mealPlan = {};
      var days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

      days.forEach(day => {
        mealPlan[day] = {};
        ["breakfast", "lunch", "dinner"].forEach(mealType => {
          // Filter meals for the current meal type
          var mealTypeMeals = filteredMeals.filter(meal => meal.mealType === mealType);
          console.log("mealTypeMeals:", mealTypeMeals);

          // Get a random meal from the filtered meals, excluding previously selected meals
          if (mealTypeMeals.length > 0) {
            var availableMeals = mealTypeMeals;

            if (availableMeals.length > 0) {
              console.log("availableMeals:", availableMeals);
              var randomMeal = availableMeals[Math.floor(Math.random() * availableMeals.length)];
              mealPlan[day][mealType] = {
                name: randomMeal.name,
                ingredients: randomMeal.ingredients
              };
            } else {
              // No meal found for this meal type, relax the filtering criteria
              let relaxedMeals = filteredMeals.length > 0 ? filteredMeals : meals;
              if (relaxedMeals.length > 0) {
                let randomMeal = relaxedMeals[Math.floor(Math.random() * relaxedMeals.length)];
                  mealPlan[day][mealType] = {
                    name: randomMeal.name,
                    ingredients: randomMeal.ingredients
                  };
              } else {
                mealPlan[day][mealType] = {
                  name: "No meal found",
                  ingredients: []
                };
              }
            }
          }
        });
      });

      // Display the meal plan
      var mealPlanHtml = "<h2>Your Meal Plan</h2>";
      days.forEach(day => {
        mealPlanHtml += "<h3>" + day + "</h3><ul>";
        ["breakfast", "lunch", "dinner"].forEach(mealType => {
          mealPlanHtml += "<li><b>" + mealType + ":</b> " + mealPlan[day][mealType].name + "<br>";
          mealPlanHtml += "<b>Ingredients:</b> " + mealPlan[day][mealType].ingredients.join(", ") + "</li>";
        });
        mealPlanHtml += "</ul>";
      });

      // Add the meal plan to the page
      document.getElementById("meal-plan-input").innerHTML = mealPlanHtml;
    })
    .catch(error => {
      console.error("Error:", error);
      alert("An error occurred while generating your meal plan. Please try again later.");
    });
}