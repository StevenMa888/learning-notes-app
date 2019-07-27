import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';

interface Note {
  _id: string,
  title: string,
  content: string,
  username: string,
  category: string
}

interface Category {
  _id: string,
  name: string,
  username: string,
}

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  private categorySub = new Subject<Category>()
  categoryObservable = this.categorySub.asObservable()
  private categoriesSub = new BehaviorSubject<Array<Category>>(null)
  categoriesObservable = this.categoriesSub.asObservable()

  constructor(private http: HttpClient, private userService: UserService) {
    this.initializeCategories()
  }

  getNotes(username: string, categoryName: string): Observable<Array<Note>> {
    return this.http.get<Array<Note>>('/api/notes', { params: { username, categoryName } } )
  }

  addNote(note: Note): Observable<any> {
    return this.http.post('/api/notes', note)
  }

  updateNote(note: Note): Observable<any> {
    return this.http.put('/api/notes/' + note._id, note)
  }

  deleteNote(note: Note, username: string): Observable<any> {
    return this.http.delete('/api/notes/' + note._id, { params: { username } })
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
      this.setCategories(categories)
    })
  }
}
