import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  getIsLoggedIn(): boolean {
    return JSON.parse(localStorage.getItem('loggedIn'))
  }

  setLoggedIn(status: boolean) {
    localStorage.setItem('loggedIn', status.toString())
  }

  removeLoggedIn() {
    localStorage.removeItem('loggedIn')
  }
}
