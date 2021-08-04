import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { RecipeService } from "../recipes/recipe.service";
import { Recipe } from "../recipes/recipe.model";

import { exhaustMap, map, take, tap } from 'rxjs/operators';
import { AuthService } from "../auth/auth.service";

@Injectable({providedIn : 'root'})
export class DataStorageService {
    constructor(private http :  HttpClient, private recipeService: RecipeService,
        private authService: AuthService){

    }
 
    storeRecipes() { 
        const recipes = this.recipeService.getRecipes();
        this.http.put('https://recipe-book-6411c-default-rtdb.firebaseio.com/recipes.json',
         recipes
         )
        .subscribe(response => {
            console.log(response);

        });
         
    }

    // fetchRecipes(){ before using authentication
    // return this.http.get<Recipe[]>('https://recipe-book-6411c-default-rtdb.firebaseio.com/recipes.json')
    //     .pipe(
    //         map(recipes => {
    //             return recipes.map(recipe => {
    //                 return {
    //                     ...recipe,
    //                     ingredients: recipe.ingredients ? recipe.ingredients : []
    //                 };

    //             });
    //         }),
    //         tap( recipes => {
    //             this.recipeService.setRecipes(recipes);
    //         console.log(recipes);
    //         })
    //         )
        // .subscribe( recipes =>{
        //     this.recipeService.setRecipes(recipes);
        //     console.log(recipes);
        // });

  //  }

//   fetchRecipes(){ """"if we don't use interceptors we use this"""""""""
//     return  this.authService.user.pipe(take(1), exhaustMap(user=>{
//           return this.http.get<Recipe[]>(
//               'https://recipe-book-6411c-default-rtdb.firebaseio.com/recipes.json?autj=' //+ user.token 
//               ,{
//                   params: new HttpParams().set('auth', user.token)
//               }
//           );
//       }),
//       map(recipes =>{
//           return recipes.map(recipe =>{
//               return {
//                   ...recipe, 
//                   ingredients: recipe.ingredients ?  recipe.ingredients : []
//               };
//           });
//       }),tap ( recipes =>{
//           this.recipeService.setRecipes(recipes);
//           console.log(recipes);
//       }));
//   }



  fetchRecipes(){
    
          return this.http.get<Recipe[]>(
              'https://recipe-book-6411c-default-rtdb.firebaseio.com/recipes.json?autj=' //+ user.token   
          ).pipe( map(recipes =>{
            return recipes.map(recipe =>{
                return {
                    ...recipe, 
                    ingredients: recipe.ingredients ?  recipe.ingredients : []
                };
            });
        }),tap ( recipes =>{
            this.recipeService.setRecipes(recipes);
            console.log(recipes);
        }));
      
    }
  

}