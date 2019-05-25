import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  getUsername() {
    return localStorage.getItem("username")
  }

  constructor(private http: HttpClient) { }

  getIsLoggedIn(): Observable<any> {
    if (!this.getUsername()) return of(false)
    return this.http.post('/api/isLoggedIn', {
      username: this.getUsername()
    })
  }

  setLoggedInUser(username: string): void {
    localStorage.setItem('username', username)
  }

  removeLoggedInUser(): void {
    localStorage.removeItem('username')
  }

  logout(): Observable<any> {
    return this.http.post('/api/logout', {
      username: this.getUsername()
    })
  }
}
