import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ShareModule } from "../shared/share.module";
import { ShoppingEditComponent } from "./shopping-edit/shopping-edit.component";
import { ShoppingListComponent } from "./shopping-list.component";

 
 @NgModule({
     declarations: [ ShoppingListComponent,
        ShoppingEditComponent,],

     imports: [
        
         FormsModule,
         RouterModule.forChild([
            { path: '', component: ShoppingListComponent },
         ]),
         ShareModule,
         CommonModule,

     ]   

 })
 export class ShoppingListModule {}