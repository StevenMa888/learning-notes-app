import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { AuthService } from '../auth.service';
declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  avatarUrl: string

  constructor(private auth: AuthService, private user: UserService) {
    this.avatarUrl = user.getAvatar()
  }

  ngOnInit() {
    $("[data-hover]").dropdownHover()
  }

  logoutUser() {
    this.auth.logoutUser()
  }

  log() {
    console.log(123)
  }

}
