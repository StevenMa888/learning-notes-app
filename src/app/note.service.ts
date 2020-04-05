import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Category } from './category.service';

export interface Note {
  _id: string,
  title: string,
  content: string,
  username: string,
  category: string
}

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  constructor(private http: HttpClient) {}

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
}
