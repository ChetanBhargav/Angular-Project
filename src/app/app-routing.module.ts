import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

const appRoutes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: 'full' },
  { path: 'recipes' , 
  loadChildren: ()=> import ('./recipes/recipes.module').then(m => m.RecipesModule) 
},//'./recipes/recipes.module#RecipesModule' if this doesn't work}
   { path : 'shopping-list', loadChildren: ()=> import ('./shopping-list/shopping-list.module').then(m => m.ShoppingListModule) }, //'./shopping-list/shopping-list.module#ShoppingListModule'},
   {
     path: 'auth',
     loadChildren: ()=> import ('./auth/auth.module').then( m => m.AuthModule) //'./auth/auth.module#AuthModule'
   }
  
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules} )],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
