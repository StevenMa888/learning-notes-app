import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  avatarSub = new Subject<Blob>()
  avatarObservable = this.avatarSub.asObservable()

  getUsername() {
    return localStorage.getItem("username")
  }

  constructor(private http: HttpClient) {
    this.refreshAvatar()
  }

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

  getAvatar(): Observable<Blob> {
    return this.http.get('/api/avatar', { 
      params: {
        username: this.getUsername() 
      },
      responseType: 'blob'
    })
  }

  setAvatar(formData: FormData): Observable<any> {
    formData.append('username', this.getUsername())
    return this.http.post('/api/avatar', formData)
  }

  refreshAvatar(): void {
    this.getAvatar().subscribe(blob => {
      this.avatarSub.next(blob)
    })
  }
}
