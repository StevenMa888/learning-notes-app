import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.less']
})
export class UserComponent implements OnInit {

  avatarUrl: string

  constructor(private user: UserService) {
    this.avatarUrl = user.getAvatar()
  }

  ngOnInit() {
  }

}
