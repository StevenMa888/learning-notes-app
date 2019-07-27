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
    this.isLoggedIn = true
    this.auth.getIsLoggedIn().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn
    })
  }

  getIsLoggedIn() {
    return localStorage.getItem("username") != null && this.isLoggedIn
  }
}
