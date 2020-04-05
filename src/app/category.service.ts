import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
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
  private categoriesSub = new BehaviorSubject<Array<Category>>(null)
  categoriesObservable = this.categoriesSub.asObservable()
  categories: Category[]
  selectedCategory: Category

  constructor(private http: HttpClient, private userService: UserService) {
    this.initializeCategories()
  }

  addCategory(category: Category): Observable<any> {
    return this.http.post('/api/categories', category)
  }

  getCategories(username): Observable<Array<Category>> {
    return this.http.get<Array<Category>>('/api/categories', { params: { username } } )
  }

  setCategory(category: Category): void {
    this.categorySub.next(category)
  }

  setCategories(categories: Array<Category>): void {
    this.categoriesSub.next(categories)
  }

  initializeCategories(): void {
    this.getCategories(this.userService.getUsername()).subscribe(categories => {
      this.categories = categories
      this.setCategories(categories)
    })
  }
}
