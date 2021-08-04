import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { map, take, tap } from "rxjs/operators";
import { AuthService } from "./auth.service";


@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
constructor(private authService: AuthService, private router: Router){

}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot
        ): boolean |UrlTree| Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
           return this.authService.user.pipe( take(1),// so that observer only listen to it once then don't care since user can emit data more than once . 
               map(user=>{
                   const isAuth= !!user
                   if (isAuth) {
                       return true;
                   }
                   return this.router.createUrlTree(['/auth']);
             //  return !!user;
               }),
            //  tap(isAuth=>{     // some edge cases this would lead to race condition with multiple redirect   
            //                      // that kind of interface with each other  
            //      if (!isAuth){
            //         this.router.navigate(['/auth']);
            //               }  
            //     }
            // )
        );


    }

}