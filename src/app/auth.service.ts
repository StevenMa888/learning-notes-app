import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { UserService } from './user.service';

interface isLoggedIn {
  status: boolean
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private user: UserService) { }

  getIsLoggedIn(): boolean {
    return this.user.getIsLoggedIn()
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
