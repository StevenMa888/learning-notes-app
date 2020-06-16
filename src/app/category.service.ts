import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { UserService } from './user.service';
import { HttpClient } from '@angular/common/http';

export interface Category {
  _id: string,
  name: string,
  username: string,
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categorySub = new Subject<Category>()
  categoryObservable = this.categorySub.asObservable()
  private categoriesSub = new Subject<Array<Category>>()
  categoriesObservable = this.categoriesSub.asObservable()
  selectedCategory: Category

  constructor(private http: HttpClient, private userService: UserService) { }

  addCategory(category: Category): Observable<any> {
    return this.http.post('/api/categories', category)
  }

  getCategories(username): Observable<Array<Category>> {
    return this.http.get<Array<Category>>('/api/categories', { params: { username } } )
  }

  setCategory(category: Category): void {
    this.selectedCategory = category
    this.categorySub.next(category)
    localStorage.setItem("category", category == null ? null : category.name)
  }

  setCategories(categories: Array<Category>): void {
    this.categoriesSub.next(categories)
  }

  initializeCategories(): void {
    this.getCategories(this.userService.currentUsername).subscribe(categories => {
      this.setCategories(categories)
      if (localStorage.getItem("category")) {
        const lastVisitedCategory = categories.find(c => c.name == localStorage.getItem("category"))
        this.setCategory(lastVisitedCategory)
      } else {
        this.setCategory(categories[0])
      }
    })
  }

  refreshCategories(): void {
    this.getCategories(this.userService.currentUsername).subscribe(categories => {
      this.setCategories(categories)
    })
  }

  deleteCategory(category: Category, username: string): Observable<any> {
    return this.http.delete('/api/categories/' + category._id, { params: { username } })
  }

  resetCategories(): void {
    this.setCategories(null)
    this.setCategory(null)
  }
}
