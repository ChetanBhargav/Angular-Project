import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { environment } from "src/environments/environment.prod";
import { User } from "./user.model";



export interface AuthResponseData {
    idToken: string;
    email: string;
    refrshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService {

    // user = new Subject<User>(); 
    user = new BehaviorSubject<User>(null); 
    private tokenExpirationTimer: any;

    constructor(private http: HttpClient, private router: Router){}

    signUp(email: string, password: string){
       return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey,
        
        {
            email: email,
            password: password,
            returnSecureToken : true,
        }
        ).pipe(catchError(this.handleError), tap(resData =>{
            this.handleAuthentication(
                resData.email,
                resData.localId,
                resData.idToken,
                +resData.expiresIn
                );
            // const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000
            // );
            // const user = new User(
            //     resData.email, 
            //     resData.localId,
            //      resData.idToken,
            //       expirationDate
            //       );
            // this.user.next(user);
        })
    );

    }

    login(email: string, password: string){
      return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
        {
            email: email,
            password: password,
            returnSecureToken : true,
        }).pipe(catchError(this.handleError),tap(resData =>{
            this.handleAuthentication(
                resData.email,
                resData.localId,
                resData.idToken,
                +resData.expiresIn
            )
        })
         );
    
    }

    autoLogin() {
        const userData: {
            email: string;
            id: string;
            _token: string;
            _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));
        if (!userData) {
            return;
        }
        const loadedUser = new User(userData.email,userData.id, userData._token, new Date(userData._tokenExpirationDate));
        if (loadedUser.token) {
            this.user.next(loadedUser);
            const expirationDuration =  new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);
        }
        this.tokenExpirationTimer = null;

    }

    logout() {
        this.user.next(null);
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);

        }

    }

    autoLogout(expirationDuration: number){
        console.log(expirationDuration)
       this.tokenExpirationTimer= setTimeout(()=>{
            this.logout();
        }, expirationDuration);

    }
    private handleAuthentication(email: string, userId: string ,token: string, expiresIn: number) {
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000
            );
            const user = new User(
                email, 
                userId,
               token,
                expirationDate
              );
            this.user.next(user);
            this.autoLogout(expiresIn * 1000);
            localStorage.setItem('userData', JSON.stringify(user));

    }

    private handleError(errorRes: HttpErrorResponse) {

        let errorMessage = 'An unknown error occurred';
        if (!errorRes.error || !errorRes.error.error){
            return throwError(errorMessage);
        }
        switch(errorRes.error.error.message) {
            case 'EMAIL_EXISTS' :
              errorMessage = 'This email exist already';
              break;
            case 'EMAIL_NOT_FOUND' :
                errorMessage = 'This email does not exist';
                break;
            case 'INVALID_PASSWORD' :
                errorMessage = 'This password is incorrect';
                break;
            case 'USER_DISABLED' :
                errorMessage = 'The user account has been disabled by an administrator.'; 
          }
          return  throwError(errorMessage);

    }

}