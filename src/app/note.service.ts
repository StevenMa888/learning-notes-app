import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

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

  constructor(private http: HttpClient) {
    
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
}
