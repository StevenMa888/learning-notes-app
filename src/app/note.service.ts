import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

interface Note {
  _id: string,
  title: string,
  content: string,
  username: string
}

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  constructor(private http: HttpClient) {
    
  }

  getAllNotes(username): Observable<Array<Note>> {
    return this.http.get<Array<Note>>('/api/notes', { params: { username } } )
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
