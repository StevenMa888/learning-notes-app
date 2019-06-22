import { Component } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  logo: string

  constructor(private auth: AuthService) {
    this.logo = "Learning Notes"
  }

  getIsLoggedIn() {
    return localStorage.getItem("username") != null
  }
}
