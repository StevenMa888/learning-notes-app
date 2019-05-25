import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(private auth: AuthService) { }

  ngOnInit() {
  }

  registerUser(event) {
    event.preventDefault()
    const target = event.target
    let username = target.querySelector('#username').value
    let password = target.querySelector('#password').value
    let confirmPassword = target.querySelector('#confirm_password').value

    if (password !== confirmPassword) {
      alert("Your two passwords don't match!")
      return
    }

    this.auth.registerUser(username, password).subscribe( data => {
      console.log(data)
    })
  }

}
