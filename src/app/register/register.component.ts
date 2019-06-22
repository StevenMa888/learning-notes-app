import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less']
})
export class RegisterComponent implements OnInit {

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
  }

  registerUser(event) {
    event.preventDefault()
    const target = event.target
    const username = target.querySelector('#username').value
    const password = target.querySelector('#password').value
    const confirmPassword = target.querySelector('#confirm_password').value

    if (password !== confirmPassword) {
      alert("Your two passwords don't match!")
      return
    }

    if (password.length < 6) {
      alert("Your password needs at least 6 digits or characters!")
      return
    }

    this.auth.registerUser(username, password).subscribe( data => {
      if (data.success) {
        alert("You have been successfully registered, please login")
        this.router.navigate(['login'])
      }
    })
  }

}
