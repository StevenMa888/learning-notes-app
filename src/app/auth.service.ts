import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { UserService } from './user.service';
import { Router } from '@angular/router';

interface isLoggedIn {
  status: boolean
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private user: UserService, private router: Router) { }

  getIsLoggedIn(): Observable<any> {
    return this.user.getIsLoggedIn()
  }

  logoutUser(): void {
    this.user.logout().subscribe(res => {
      if (res.success) {
        this.user.removeLoggedInUser()
        this.router.navigate(['login'])
      } else {
        alert(res.message)
      }
    });
  }

  checkUser(username, password): Observable<any> {
    return this.http.post('/api/checkUser', {
      username,
      password
    })
  }

  registerUser(username, password): Observable<any> {
    return this.http.post('/api/register', {
      username,
      password
    })
  }
}
