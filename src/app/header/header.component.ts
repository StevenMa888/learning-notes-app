import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { AuthService } from '../auth.service';
import { NoteService } from '../note.service';
declare var $: any;

interface Category {
  _id: string,
  name: string,
  username: string,
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {

  avatarUrl: string
  messageCount: number
  categories: Array<Category>

  constructor(private auth: AuthService, private userService: UserService, private noteService: NoteService) {
    this.avatarUrl = userService.getAvatar()
    this.messageCount = 500
    noteService.categoriesObservable.subscribe(categories => {
      this.categories = categories
    })
  }

  ngOnInit() {

  }

  logoutUser(): void {
    this.auth.logoutUser()
  }

  setCategory(category: Category): void {
    this.noteService.setCategory(category)
  }

}
