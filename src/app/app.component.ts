import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  logo: string
  isLoggedIn: boolean

  constructor(private auth: AuthService) {
    this.logo = "Learning Notes"
    this.auth.getIsLoggedIn().subscribe(isLoggedIn => {
      if (isLoggedIn == null) return // disregard initial value null
      this.isLoggedIn = isLoggedIn
    })
  }

  getIsLoggedIn() {
    return localStorage.getItem("username") != null && this.isLoggedIn
  }
}
