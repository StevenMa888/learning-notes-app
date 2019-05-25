import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';

interface isLoggedIn {
  status: boolean
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  getIsLoggedIn(): boolean {
    return JSON.parse(localStorage.getItem('loggedIn'))
  }

  setLoggedInStatus(status: boolean) {
    localStorage.setItem('loggedIn', status.toString())
  }

  getUserDetails(username, password): Observable<any> {
    return this.http.post('/api/user', {
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
