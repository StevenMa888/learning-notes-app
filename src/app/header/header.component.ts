import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { AuthService } from '../auth.service';
declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {

  avatarUrl: string
  messageCount: number

  constructor(private auth: AuthService, private user: UserService) {
    this.avatarUrl = user.getAvatar()
    this.messageCount = 500
  }

  ngOnInit() {

  }

  logoutUser() {
    this.auth.logoutUser()
  }

}
