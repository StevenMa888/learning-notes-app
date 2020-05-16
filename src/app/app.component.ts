import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  logo: string
  isLoggedIn: boolean

  constructor(private authService: AuthService, private userService: UserService) {
    this.logo = "Learning Notes"
    this.authService.isLoggedInObservable.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn
    })
  }

  getIsLoggedIn() {
    return this.userService.currentUsername != null && this.isLoggedIn
  }
}
