import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable, Subject } from 'rxjs';
import { UserService } from './user.service';
import { Router } from '@angular/router';

interface isLoggedIn {
  status: boolean
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isLoggedInSub = new Subject<boolean>()
  isLoggedInObservable = this.isLoggedInSub.asObservable()

  constructor(private http: HttpClient, private user: UserService, private router: Router) {
    this.initializeIsLoggedIn()
  }

  getIsLoggedIn(): Observable<any> {
    return this.user.getIsLoggedIn()
  }

  setIsLoggedIn(isLoggedIn: boolean): void {
    this.isLoggedInSub.next(isLoggedIn)
  }

  initializeIsLoggedIn(): void {
    this.user.getIsLoggedIn().subscribe(isLoggedIn => {
      this.setIsLoggedIn(isLoggedIn)
    })
  }

  loginUser(username: string, password: string): void {
    this.checkUser(username, password).subscribe(data => {
      if (data.success) {
        this.user.setLoggedInUser(username)
        this.setIsLoggedIn(true)
        this.router.navigate([''])
      } else {
        alert("Username or password is incorrect, please try again")
      }
    })
  }

  logoutUser(): void {
    this.user.logout().subscribe(res => {
      if (res.success) {
        this.user.removeLoggedInUser()
        this.setIsLoggedIn(false)
        localStorage.removeItem("category")
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
