import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule,  } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';

import { AppRoutingModule } from './app-routing.module';



import { ShareModule } from './shared/share.module';
import { CoreModule} from './core.module';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    // DropdownDirective,
    // AuthComponent,
    // LoadingSpinnerComponent,
    // AlertComponent,
    // PlaceHolderDirective,
    
  ],
  imports: [
    BrowserModule,
   // AuthModule, 
    AppRoutingModule,
    HttpClientModule,
    // RecipesModule,
   // ShoppingListModule,
    ShareModule,
    CoreModule], 
 
  bootstrap: [AppComponent]
})
export class AppModule {}
