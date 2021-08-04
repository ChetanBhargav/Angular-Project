import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode = false;
  recipeForm: FormGroup;

  constructor(private route: ActivatedRoute,
              private recipeService: RecipeService,
              private router: Router) { }

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id'];
          this.editMode = params['id'] != null;
          this.initForm();
        }
      );
  }

  onSubmit(){
    //console.log(this.recipeForm);

    const newRecipe = new Recipe(
      this.recipeForm.value['name'],
      this.recipeForm.value['description'],
      this.recipeForm.value['imagePatha'],
      this.recipeForm.value['ingredients']);
    if(this.editMode){
     this.recipeService.updateRecipe(this.id, newRecipe);
     // this.recipeService.updateRecipe(this.id, this.recipeForm.value);
    } else {
     // this.recipeService.addRecipe(this.recipeForm.value)
      this.recipeService.addRecipe(newRecipe)
    }
   // this.router.navigate(['../'], {relativeTo: this.route});
   this.onCancel();
  }

  onCancel(){
    this.router.navigate(['../'], {relativeTo: this.route});
  }
  get controls() { // a getter!
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }


  onAddIngredient(){
    this.controls.push(
      new FormGroup({
        'name': new FormControl(null,Validators.required),
        'amount': new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/)
     ]),
      })
    );
  }

  onDeleteIngredient(index: number){
    this.controls.splice(index ,1); //this work
   // this.controls.clear(); doesn't work
    // (<FormArray>this.recipeForm.get('ingredients')).clear();   this clear whole  ingredient array
   // this.controls.removeAt(index); doesn't work
  }

  private initForm(){
     let recipeName = '';
     let recipeDescription ='';
     let recipeImagePath = '';
     let recipeIngredients = new FormArray([]);
     

     if (this.editMode){
       const recipe = this.recipeService.getRecipe(this.id);
       recipeName= recipe.name;
       recipeImagePath = recipe.imagePath;
       recipeDescription = recipe.description;
       if (recipe['ingredients']){
         for (let ingredient of recipe.ingredients){
           recipeIngredients.push(
             new FormGroup({
               'name': new FormControl(ingredient.name,Validators.required),
               'amount': new FormControl(ingredient.amount, [
                 Validators.required,
                 Validators.pattern(/^[1-9]+[0-9]*$/)
            ]),
             })
           );
         }
       }
     }

    this.recipeForm = new FormGroup({
      'name': new FormControl( recipeName, Validators.required),
      'description': new FormControl(recipeDescription,Validators.required),
      'imagePath': new FormControl(recipeImagePath,Validators.required),
      'ingredients': recipeIngredients
    });
  }

}
