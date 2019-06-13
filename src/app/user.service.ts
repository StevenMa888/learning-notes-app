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

  getAvatar(): string {
    return "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1559156233488&di=4da5aff32b7bdd563b43f0aa9bf97f34&imgtype=0&src=http%3A%2F%2Fpic.qingting.fm%2F2017%2F1006%2F20171006203135646809.jpg%2521800"
  }
}
