import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { UserService } from '../user.service';
import { NoteService } from '../note.service';
import { Observable } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd';

interface Note {
  _id: string,
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

  constructor(private noteService: NoteService, private messageService: NzMessageService) {
    this.refreshNotes()
  }

  ngOnInit() {
  }

  refreshNotes() {
    this.noteService.getAllNotes().subscribe(notes => {
      if (notes) {
        this.notes = notes
      }
    })
  }

  addNewNote(): void {
    const loadingMessageId = this.messageService.loading('Saving in progress').messageId
    const note = {'_id': '', 'title': 'test', 'content': 'test content'}
    this.noteService.addNote(note).subscribe(res => {
      this.messageService.remove(loadingMessageId)
      this.messageService.success('Notes savesd', { nzDuration: 1500 })
      this.refreshNotes()
    })
  }

  showModal(note: Note): void {
    this.currentNote = note
    this.modalTitle = note.title
    this.modalContent = `Save changes to "${note.title}?"`
    this.isVisible = true
  }

  handleOk(): void {
    this.isOkLoading = true
    this.noteService.updateNote(this.currentNote).subscribe(res => {
      if (res.success) {
        this.messageService.success(`Note ${this.currentNote.title} has been updated`, { nzDuration: 1500})
        this.refreshNotes()
      } else {
        this.messageService.error(res.message, { nzDuration: 2500 })
      }
      this.isVisible = false
      this.isOkLoading = false
      this.currentNote = null
    })
  }

  handleCancel(): void {
    this.isVisible = false
    this.currentNote = null
  }

  deleteNote(note: Note): void {
    this.noteService.deleteNote(note).subscribe(res => {
      if (res.success) {
        this.messageService.success(`Note ${note.title} has been deleted`, { nzDuration: 1500})
        this.refreshNotes()
      } else {
        this.messageService.error(res.message, { nzDuration: 2500 })
      }
    })
  }

}
