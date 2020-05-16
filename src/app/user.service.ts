import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  currentUsername: string
  avatarSub = new Subject<Blob>()
  avatarObservable = this.avatarSub.asObservable()

  getUsernameInLocalStorage() {
    return localStorage.getItem("username")
  }

  constructor(private http: HttpClient) {
    this.currentUsername = this.getUsernameInLocalStorage()
    this.refreshAvatar()
  }

  getIsLoggedIn(): Observable<boolean> {
    if (!this.currentUsername) {
      return of(false)
    }
    return this.http.post<boolean>('/api/isLoggedIn', {
      username: this.currentUsername
    })
  }

  setLoggedInUser(username: string): void {
    localStorage.setItem('username', username)
    this.currentUsername = username
  }

  removeLoggedInUser(): void {
    // localStorage.removeItem('username')
    this.currentUsername = null
  }

  logout(): Observable<any> {
    return this.http.post('/api/logout', {
      username: this.currentUsername
    })
  }

  getAvatar(): Observable<Blob> {
    if (this.currentUsername == null) {
      return of(null)
    }
    return this.http.get('/api/avatar', { 
      params: {
        username: this.currentUsername
      },
      responseType: 'blob'
    })
  }

  setAvatar(formData: FormData): Observable<any> {
    formData.append('username', this.currentUsername)
    return this.http.post('/api/avatar', formData)
  }

  refreshAvatar(): void {
    this.getAvatar().subscribe(blob => {
      this.avatarSub.next(blob)
    })
  }
}
