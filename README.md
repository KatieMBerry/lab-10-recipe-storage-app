# LAB: Express

Build a recipe storage application. It should let you create new recipes, get a recipe by id,
get all recipes, update a recipe by id, and delete a recipe by id.

## Getting Started

In the `starter-code`, there the basic scaffolding for a recipe storage application.
Take a look at the included files.

## Requirements

### Missing Tests (1 points)

There are some missing tests. Determine any gaps in test coverage and fill
in the gaps (focus on missing route tests).

### Use the error handling middleware (3 points)

Update your routes so if an error occurs the error is handled by the error handling
middleware.

UPDATE THE ERROR HANDLING MIDDLEWARE SO THAT THE STATUS CODE IS PORT OF THE RESPONSE
body. For example:

```json
{
  "status": 404,
  "message": "Recipe with id 1 not found"
}
```

Set the status code to 404 when the a row can't be found with the given id.

### Refactor to use Router (3 points)

To help promote cleaner code, refactor your routes into a `lib/controllers/recipes.js` file.
Use and export an `express.Router`.

### Add a second model (3 point)

Add a `Log` model which tracks when you used a recipe. A `Log` has:
`recipeId`, `dateOfEvent`, `notes`, and `rating`. Create all CRUD routes
for your `Log` model

### Add ingredients (1 points)

Our model is incomplete. In order to provide a better user experience our recipes
should include the ingredients needed for a recipes. Add an `ingredients` field,
which is an array with `amount`, `measurement`, and `name` (use a JSONB column).

## Rubric

* Missing tests 1 points
* Error handling 3 points
* Router 2 points
* Second model 3 points
* ingredients 1 point
