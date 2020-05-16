import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.auth.getIsLoggedIn().pipe(map(isLoggedIn => {
        const path = next.routeConfig.path
        if(isLoggedIn == true) {
          if (path == 'login' || path == 'register') {
            this.router.navigate([''])
          }
          return true
        } else {
          if (path == 'login' || path == 'register') {
            return true
          }
          this.router.navigate(['login'])
          return false
        }
      }))
  }
  
}
