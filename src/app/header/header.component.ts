import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { AuthService } from '../auth.service';
import { NoteService } from '../note.service';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { Category, CategoryService } from '../category.service';
declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {

  avatarUrl: SafeUrl
  messageCount: number
  categories: Array<Category>
  selectedCategory: Category

  constructor(private sanitizer: DomSanitizer, private auth: AuthService, private userService: UserService, private categoryService: CategoryService) {
    userService.avatarObservable.subscribe(blob => {
      const url = URL.createObjectURL(blob)
      this.avatarUrl = sanitizer.bypassSecurityTrustResourceUrl(url)
    })
    categoryService.categoriesObservable.subscribe(categories => {
      this.categories = categories
    })
    categoryService.categoryObservable.subscribe(category => {
      this.selectedCategory = category
    })
  }

  ngOnInit() {

  }

  logoutUser(): void {
    this.auth.logoutUser()
  }

  setCategory(category: Category): void {
    this.categoryService.setCategory(category)
  }

}
