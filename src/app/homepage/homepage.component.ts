import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { UserService } from '../user.service';
import { NoteService, Note } from '../note.service';
import { Observable, Subscription } from 'rxjs';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Category, CategoryService } from '../category.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.less']
})
export class HomepageComponent implements OnInit, OnDestroy {

  username: string
  notes: Array<Note>
  currentNote: Note
  isVisibleUpdate: boolean
  isOkLoadingUpdate: boolean
  modalTitleUpdate: string
  modalContentUpdate: string
  isVisibleAdd: boolean
  isOkLoadingAdd: boolean
  modalTitleAdd: string
  modalCategoryAdd: string
  modalContentAdd: string
  isVisibleAddCategory: boolean
  isModalCategoryAddDropdownOpen: boolean
  isOkLoadingAddCategory: boolean
  modalContentAddCategory: string
  categories: Array<Category>
  categoriesSubscription: Subscription
  categorySubscription: Subscription

  constructor(private userService: UserService, private categoryService: CategoryService,
    private noteService: NoteService, private messageService: NzMessageService,
    private modalService: NzModalService, private router: Router
  ) { }

  ngOnInit() {
    this.username = this.userService.currentUsername
    this.categoriesSubscription = this.categoryService.categoriesObservable.subscribe(categories => {
      this.categories = categories
    })
    this.categorySubscription = this.categoryService.categoryObservable.subscribe(category => {
      this.categoryService.selectedCategory = category
      if (category == null) {
        this.modalCategoryAdd = null
        this.notes = []
        return
      }
      this.modalCategoryAdd = category.name
      this.refreshNotes()
    })
    if (this.notes == null && this.categoryService.selectedCategory != null) {
      this.categoryService.refreshCategories()
      this.categoryService.setCategory(this.categoryService.selectedCategory)
    }
  }

  refreshNotes() {
    this.noteService.getNotes(this.username, this.categoryService.selectedCategory.name).subscribe(notes => {
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
    this.refreshNotes()
  }

  showModalAdd(): void {
    this.isVisibleAdd = true
  }

  handleOkAdd(): void {
    if (this.isEmpty(this.modalCategoryAdd)) {
      alert("Please select a category")
      return
    }
    if (this.isEmpty(this.modalTitleAdd) || this.isEmpty(this.modalContentAdd)) {
      alert("Please fill in title and content")
      return
    }
    this.isOkLoadingAdd = true
    const note = { _id: '', title: this.modalTitleAdd, content: this.modalContentAdd, username: this.username, category: this.modalCategoryAdd}
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
      this.modalCategoryAdd = this.categoryService.selectedCategory.name
      this.modalTitleAdd = ''
      this.modalContentAdd = ''
    })
  }

  handleCancelAdd(): void {
    this.isVisibleAdd = false
  }

  showModalAddCategory(): void {
    this.modalContentAddCategory = ""
    this.isModalCategoryAddDropdownOpen = false
    this.isVisibleAddCategory = true
  }

  handleOkAddCategory(): void {
    this.isOkLoadingAddCategory = true
    const category = { _id: '', name: this.modalContentAddCategory, username: this.username}
    const loadingMessageId = this.messageService.loading('Saving in progress').messageId
    this.categoryService.addCategory(category).subscribe(res => {
      this.messageService.remove(loadingMessageId)
      if (res.success) {
        this.messageService.success('New category added', { nzDuration: 1500 })
        this.categoryService.getCategories(this.username).subscribe(categories => {
          this.categoryService.setCategories(categories)
          this.categoryService.setCategory(categories[categories.length - 1])
          this.refreshNotes()
        })
      } else {
        this.messageService.error(res.message, { nzDuration: 2500 })
      }
      this.isVisibleAddCategory = false
      this.isOkLoadingAddCategory = false
    })
  }

  handleCancelAddCategory(): void {
    this.isVisibleAddCategory = false
  }

  showDeleteNoteConfirm(note: Note): void {
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
    this.noteService.deleteNote(note, this.username).subscribe(res => {
      if (res.success) {
        this.messageService.success(`Note ${note.title} has been deleted`, { nzDuration: 1500})
        this.refreshNotes()
      } else {
        this.messageService.error(res.message, { nzDuration: 2500 })
      }
    })
  }

  showDeleteCategoryConfirm(): void {
    const currentCategory = this.categoryService.selectedCategory
    if (currentCategory == null) {
      this.messageService.error('There is no category to delete!')
    }
    this.modalService.confirm({
      nzTitle: 'Are you sure to delete this category?',
      nzContent: `<b style="color: red;">${currentCategory.name}</b>`,
      nzOkText: 'Yes',
      nzOkType: 'danger',
      nzOnOk: () => this.deleteCategory(currentCategory),
      nzCancelText: 'No',
      nzOnCancel: () => {}
    });
  }

  deleteCategory(category: Category): void {
    this.categoryService.deleteCategory(category, this.username).subscribe(res => {
      if (res.success) {
        this.messageService.success(`Category ${category.name} has been deleted`, { nzDuration: 1500})
        this.categoryService.initializeCategories()
      } else {
        this.messageService.error(res.message, { nzDuration: 2500 })
      }
    })
  }

  isEmpty(value: string) {
    return value == null || value == ''
  }

  @HostListener('unloaded')
  ngOnDestroy(): void {
    this.categoriesSubscription.unsubscribe()
    this.categorySubscription.unsubscribe()
  }
}
