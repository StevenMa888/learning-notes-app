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

  getIsLoggedIn(): Observable<isLoggedIn> {
    return this.http.get<isLoggedIn>('/api/isLoggedIn')
  }

  getData() {
    return true;
  }

  registerUser(username, password): Observable<any> {
    return this.http.post('/api/register', {
      username,
      password
    })
  }
}
