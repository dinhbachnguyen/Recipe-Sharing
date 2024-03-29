import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  newRecipe = { name: '', description: '',  ingredient: '', recipe: '', rating: '', comment: '' };
  recipes: any[] = [];

  ngOnInit(): void {
    this.fetchRecipes();
  }

  async addRecipe(event: Event) {
    event.preventDefault();
    
    const response = await fetch('http://localhost:4000/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation {
            addRecipe(name: "${this.newRecipe.name}", description: "${this.newRecipe.description}", 
            ingredient: "${this.newRecipe.ingredient}", recipe: "${this.newRecipe.recipe}",
            rating: "${this.newRecipe.rating}", comment: "${this.newRecipe.comment}") {
              name
              description
              ingredient
              recipe
              rating
              comment
            }
          }
        `,
      }),
    });

    const result = await response.json();

    if (result.errors) {
      console.error(result.errors);
    } else {
      console.log(`Recipe added successfully!`);
      this.newRecipe.name = '';
      this.newRecipe.description = '';
      this.newRecipe.ingredient = '';
      this.newRecipe.recipe = '';
      this.newRecipe.rating = '';
      this.newRecipe.comment = '';
      this.fetchRecipes();
    }
  }

  async deleteRecipe(index: number) {
    if (index >= 0 && index < this.recipes.length) {
      const recipeToDelete = this.recipes[index];
      const recipeId = recipeToDelete._id; 
      const response = await fetch('http://localhost:4000/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation {
              deleteRecipe(_id: "${recipeId}") {
                success
              }
            }
          `,
        }),
      });

      const result = await response.json();

      if (result.errors) {
        console.error(result.errors);
      } else {
        console.log('Recipe deleted successfully on the server!');
        this.recipes.splice(index, 1); 
      }
    }
  }

  async fetchRecipes() {
    const response = await fetch('http://localhost:4000/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query {
            recipes {
              _id
              name
              description
              ingredient
              recipe
              rating
              comment
            }
          }
        `,
      }),
    });

    const result = await response.json();

    if (result.errors) {
      console.error(result.errors);
    } else {
      this.recipes = result.data.recipes;
    }
  }
}
