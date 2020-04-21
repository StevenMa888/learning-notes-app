import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { AuthService } from '../auth.service';
import { NoteService } from '../note.service';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { Category, CategoryService } from '../category.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {

  avatarUrl: Observable<SafeUrl>
  messageCount: number
  categories: Array<Category>
  selectedCategory: Category

  constructor(private sanitizer: DomSanitizer,
    private auth: AuthService,
    private userService: UserService,
    private categoryService: CategoryService,
    private router: Router) {
    this.avatarUrl = userService.avatarObservable.pipe(map(blob => {
      const url = URL.createObjectURL(blob)
      return sanitizer.bypassSecurityTrustResourceUrl(url)
    }))
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
    if (this.router.url != '/') {
      this.router.navigate([''])
    }
    this.categoryService.setCategory(category)
  }

}
