# Defining Feature Journeys

Journeys in the `workflow-feature` skill represent the user path through the new feature. Defining these early helps ensure the UI and API designs cover all necessary states.

## Standard Journey Steps
When defining a journey for a feature, consider:
1. **Entry Point**: How does the user reach this feature? (e.g., Navigation drawer, FAB).
2. **Main Action**: What is the primary task the user performs?
3. **Success State**: What does the user see when the task is complete?
4. **Error/Empty States**: What happens if the API fails or there is no data?

## Example Journey
For a "Favorite Cities" feature:
- **Step 1**: User taps the heart icon on a city detail screen.
- **Step 2**: The app persists the city locally via Room.
- **Step 3**: A Snackbar confirms the action.
- **Step 4**: User navigates to the "Favorites" screen to see the updated list.
