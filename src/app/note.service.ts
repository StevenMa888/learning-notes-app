import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

interface Note {
  title: string,
  content: string
}

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  constructor(private http: HttpClient) {
    
  }

  getAllNotes(): Observable<Array<Note>> {
    return this.http.get<Array<Note>>('/api/notes')
  }

  addNote(note: Note): Observable<any> {
    return this.http.post('/api/notes', note)
  }
}
