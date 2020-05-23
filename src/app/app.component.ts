import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { UserService } from './user.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  logo: string
  isLoggedIn: boolean
  validUrls: string[]
  isValidUrl: boolean

  constructor(private authService: AuthService, private userService: UserService, private router: Router) {
    this.logo = "Learning Notes"
    this.validUrls = this.router.config.map(r => '/' + r.path)
  }

  ngOnInit() {
    this.authService.isLoggedInObservable.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn
    })
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isValidUrl = this.validUrls.indexOf(event.url) > -1
      }
    })
  }

  getIsLoggedIn() {
    return this.userService.currentUsername != null && this.isLoggedIn && this.isValidUrl
  }
}
