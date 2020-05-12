import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  rememberMe: boolean
  initialRememberMe: boolean
  initialUsername: string

  constructor(private auth: AuthService, private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.initialRememberMe = localStorage.getItem('rememberMe') == 'true'
    this.rememberMe = this.initialRememberMe
    this.initialUsername = this.userService.currentUsername
  }

  loginUser(event) {
    event.preventDefault()
    const target = event.target
    const username = target.querySelector('#username').value
    const password = target.querySelector('#password').value
    this.auth.loginUser(username, password)
    localStorage.setItem('rememberMe', this.rememberMe.toString())
  }

}
