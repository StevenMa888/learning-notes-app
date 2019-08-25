import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { AuthService } from '../auth.service';
import { NoteService } from '../note.service';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
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

  avatarUrl: SafeUrl
  messageCount: number
  categories: Array<Category>

  constructor(private sanitizer: DomSanitizer, private auth: AuthService, private userService: UserService, private noteService: NoteService) {
    userService.avatarObservable.subscribe(blob => {
      const url = URL.createObjectURL(blob)
      this.avatarUrl = sanitizer.bypassSecurityTrustResourceUrl(url)
    })
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
