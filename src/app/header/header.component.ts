import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../user.service';
import { AuthService } from '../auth.service';
import { NoteService } from '../note.service';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { Category, CategoryService } from '../category.service';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit, OnDestroy {

  avatarUrl: Observable<SafeUrl>
  messageCount: number
  categories: Array<Category>
  selectedCategory: Category
  categoriesSubscription: Subscription
  categorySubscription: Subscription

  constructor(private sanitizer: DomSanitizer,
    private auth: AuthService,
    private userService: UserService,
    private categoryService: CategoryService,
    private router: Router) { }

  ngOnInit() {
    this.avatarUrl = this.userService.avatarObservable.pipe(map(blob => {
      const url = URL.createObjectURL(blob)
      return this.sanitizer.bypassSecurityTrustResourceUrl(url)
    }))
    this.categoriesSubscription = this.categoryService.categoriesObservable.subscribe(categories => {
      this.categories = categories
    })
    this.categorySubscription = this.categoryService.categoryObservable.subscribe(category => {
      this.selectedCategory = category
    })
    this.categoryService.initializeCategories()
  }

  logoutUser(): void {
    this.auth.logoutUser()
    this.categoryService.resetCategories()
  }

  setCategory(category: Category): void {
    if (this.router.url != '/') {
      this.router.navigate([''])
    }
    this.categoryService.setCategory(category)
  }

  ngOnDestroy(): void {
    this.categoriesSubscription.unsubscribe()
    this.categorySubscription.unsubscribe()
  }

}
