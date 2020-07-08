import { Component, AfterViewInit, EventEmitter, OnDestroy, Input,Output, OnInit } from '@angular/core';
import tinymce from 'tinymce';

@Component({
  selector: 'app-tiny-editor',
  templateUrl: './tiny-editor.component.html',
  styleUrls: ['./tiny-editor.component.less']
})
export class TinyEditorComponent implements OnInit {
  @Input() content: string
  @Output() focus = new EventEmitter<boolean>()
  @Output() contentChange = new EventEmitter<string>()
  @Output() contentChanged = new EventEmitter<string>()
  initialContent: string
  hasChanges: boolean

  config = {
    base_url: '/tinymce',
    menubar: false,
    inline: true,
    // plugins: ['image paste media'],
    plugins: ['autoresize', 'autolink', 'codesample', 'link', 'lists', 'media', 'table', 'image', 'quickbars', 'codesample', 'help'],
    autoresize_bottom_margin: 0, 
    autoresize_max_height: 500,
    toolbar: false,
    language: 'zh_CN',
    language_url: '/tinymce/langs/zh_CN.js',
    // automatic_uploads: false,
    // images_upload_url: 'http://localhost:9090/vue/image',
    // paste_data_images: true,
    branding: false,
    quickbars_insert_toolbar: 'quicktable image media codesample',
    quickbars_selection_toolbar: 'bold italic underline | formatselect | blockquote quicklink',
    contextmenu: 'undo redo | inserttable | cell row column deletetable | help'
  }

  constructor() { }

  ngOnInit() {
    this.initialContent = this.content
  }

  onFocusIn() {
    this.focus.emit(true)
  }

  checkContentChange() {
    if (this.content != this.initialContent) {
      this.hasChanges = true
      this.contentChanged.emit(this.content)
    } else {
      this.hasChanges = false
      this.contentChanged.emit(null)
    }
  }

  emitContentChange() {
    this.contentChange.emit(this.content)
  }

  cancelChange() {
    this.content = this.initialContent
    this.hasChanges = false
  }
}