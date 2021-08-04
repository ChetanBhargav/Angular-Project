import { Component, ComponentFactoryResolver, OnDestroy, ViewChild, } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthResponseData, AuthService } from './auth.service';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceHolderDirective } from '../shared/placeholder/placeholder.directive';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnDestroy  {

  constructor(private authService: AuthService, private router: Router, private componentFactoryResolver: ComponentFactoryResolver){}

  isLoginMode = true;
  isLoading = false;
  error:string = null;
  @ViewChild(PlaceHolderDirective, {static: false}) alerHost: PlaceHolderDirective;// So we get access to that directive we use in the template and we store that in alert host.
  
  private closeSubscription: Subscription;


  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
    console.log('login' , this.isLoginMode)
  }

  onSubmit(form: NgForm){
    //console.log(form.value);
    if (!form.valid){
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    let authObs: Observable<AuthResponseData>;

    this.isLoading = true;
    if (this.isLoginMode){
    authObs=  this.authService.login(email,password);
      // .subscribe(resData =>{     /// if we don't use authObs we can use this authObs is used to reduce code and since we are 
      ///   getting same response while login and signup

      //   console.log('resData');
      //   this.isLoading = false;
      // },
      //  errorMessage =>{
      //   console.log(errorMessage);
      //   this.error = errorMessage;
      //   // switch(errorRes.error.error.message) {
      //   //   case 'EMAIL_EXISTS' :
      //   //     this.error = 'This email exist already';
      //   // }
      //   // this.error = 'An error occurred!'
      //   this.isLoading = false;
      // });
      
    }
    else{
     authObs= this.authService.signUp(email,password);
    
    
    }
    authObs.subscribe(resData =>{
      console.log('resData');
      this.isLoading = false;
      this.router.navigate(['/recipes']);
    },
     errorMessage =>{
      console.log(errorMessage);
      this.error = errorMessage;
      this.showErrorAlert(errorMessage);
      // switch(errorRes.error.error.message) {
      //   case 'EMAIL_EXISTS' :
      //     this.error = 'This email exist already';
      // }
      // this.error = 'An error occurred!'
      this.isLoading = false;
    });

    form.reset(); 
  }

  private showErrorAlert(message: string){

const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(
  AlertComponent

  );
  const hostViewContainerRef = this.alerHost.viewContainerRef;
  hostViewContainerRef.clear();

 const componentRef=  hostViewContainerRef.createComponent(alertCmpFactory);

 componentRef.instance.message = message; 

 this.closeSubscription = componentRef.instance.close.subscribe(()=>{
   this.closeSubscription.unsubscribe();
   hostViewContainerRef.clear();


 }); 


   // const alertCmp = new AlertComponent(); 
   //Now this is a valid TypeScript code but it is not valid Angular code,

// this will not throw an error if you compile it but it also won't work in any way.

// You can't work with that alert component then in the way Angular needs to work with it because Angular

// does a lot more than just create an object when it instantiate a component.

// It needs to wire it up,

// it needs to wire it up to change detection into the DOM,

// this here would be a normal Javascript object and that is not what Angular needs. So therefore, you can't

// create your own component like that,

// this here won't work.

  }

  onHandleError() {
    this.error = null;
  }
  ngOnDestroy(){
    if (this.closeSubscription)
    this.closeSubscription.unsubscribe();
  }

  
}
