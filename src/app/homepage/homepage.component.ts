import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { UserService } from '../user.service';
import { NoteService } from '../note.service';
import { Observable } from 'rxjs';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';

interface Note {
  _id: string,
  title: string,
  content: string,
  username: string
}

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.less']
})
export class HomepageComponent implements OnInit {

  currentUser: string
  notes: Array<Note>
  currentNote: Note
  isVisibleUpdate: boolean
  isOkLoadingUpdate: boolean
  modalTitleUpdate: string
  modalContentUpdate: string
  isVisibleAdd: boolean
  isOkLoadingAdd: boolean
  modalTitleAdd: string
  modalContentAdd: string

  constructor(private userService: UserService, private noteService: NoteService, private messageService: NzMessageService, private modalService: NzModalService) {
    this.currentUser = userService.getUsername()
    this.refreshNotes()
  }

  ngOnInit() {
  }

  refreshNotes() {
    this.noteService.getAllNotes(this.currentUser).subscribe(notes => {
      if (notes) {
        this.notes = notes
      }
    })
  }

  showModalUpdate(note: Note): void {
    this.currentNote = note
    this.modalTitleUpdate = `Save changes to "${note.title}?"`
    this.modalContentUpdate = note.content
    this.isVisibleUpdate = true
  }

  handleOkUpdate(): void {
    this.isOkLoadingUpdate = true
    this.currentNote.content = this.modalContentUpdate
    this.noteService.updateNote(this.currentNote).subscribe(res => {
      if (res.success) {
        this.messageService.success(`Note ${this.currentNote.title} has been updated`, { nzDuration: 1500})
        this.refreshNotes()
      } else {
        this.messageService.error(res.message, { nzDuration: 2500 })
      }
      this.isVisibleUpdate = false
      this.isOkLoadingUpdate = false
      this.currentNote = null
    })
  }

  handleCancelUpdate(): void {
    this.isVisibleUpdate = false
    this.currentNote = null
  }

  showModalAdd(): void {
    this.modalTitleAdd = ""
    this.modalContentAdd = ""
    this.isVisibleAdd = true
  }

  handleOkAdd(): void {
    this.isOkLoadingAdd = true
    const note = { _id: '', title: this.modalTitleAdd, content: this.modalContentAdd, username: this.currentUser}
    const loadingMessageId = this.messageService.loading('Saving in progress').messageId
    this.noteService.addNote(note).subscribe(res => {
      this.messageService.remove(loadingMessageId)
      if (res.success) {
        this.messageService.success('Notes savesd', { nzDuration: 1500 })
        this.refreshNotes()
      } else {
        this.messageService.error(res.message, { nzDuration: 2500 })
      }
      this.isVisibleAdd = false
      this.isOkLoadingAdd = false
    })
  }

  handleCancelAdd(): void {
    this.isVisibleAdd = false
  }

  showDeleteConfirm(note: Note): void {
    this.modalService.confirm({
      nzTitle: 'Are you sure to delete this note?',
      nzContent: `<b style="color: red;">${note.title}</b>`,
      nzOkText: 'Yes',
      nzOkType: 'danger',
      nzOnOk: () => this.deleteNote(note),
      nzCancelText: 'No',
      nzOnCancel: () => {}
    });
  }

  deleteNote(note: Note): void {
    this.noteService.deleteNote(note, this.currentUser).subscribe(res => {
      if (res.success) {
        this.messageService.success(`Note ${note.title} has been deleted`, { nzDuration: 1500})
        this.refreshNotes()
      } else {
        this.messageService.error(res.message, { nzDuration: 2500 })
      }
    })
  }

}
