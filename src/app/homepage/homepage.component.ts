import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { UserService } from '../user.service';
import { NoteService } from '../note.service';
import { Observable } from 'rxjs';

interface Note {
  title: string,
  content: string
}

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.less']
})
export class HomepageComponent implements OnInit {

  notes: Array<Note>
  currentNote: Note
  isVisible: boolean
  isOkLoading: boolean
  modalTitle: string
  modalContent: string

  constructor(private noteService: NoteService) {
    noteService.getAllNotes().subscribe(notes => {
      if (notes) {
        this.notes = notes
      }
    })
  }

  ngOnInit() {
  }

  addNewNote() {
    const note = {'title': 'test', 'content': 'test content'}
    this.noteService.addNote(note).subscribe(res => {
      alert(res.message)
    })
  }

  showModal(note: Note) {
    this.currentNote = note
    this.modalTitle = note.title
    this.modalContent = `Save changes to "${note.title}?"`
    this.isVisible = true
  }

  handleOk(): void {
    this.isOkLoading = true;
    setTimeout(() => {
      this.isVisible = false;
      this.isOkLoading = false;
    }, 1000);
  }

  handleCancel(): void {
    this.isVisible = false;
    this.currentNote = null
  }

}
