import { Component, OnInit } from '@angular/core'
import { UserService } from '../user.service'
import { NzMessageService, UploadFile } from 'ng-zorro-antd'
import { Observable, Observer } from 'rxjs'

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.less']
})
export class UserComponent implements OnInit {

  username: Object
  loading: boolean = false
  avatarUrl: string | undefined = ''
  previewVisible = false
  previewImage: string | undefined = ''
  fileList: UploadFile[] = []
  showUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    hidePreviewIconInNonImage: true
  }

  constructor(private user: UserService, private msg: NzMessageService) {
    this.username = {username: user.getUsername()}
    this.avatarUrl = "" //user.getAvatar()
  }

  ngOnInit() {
  }
  beforeUpload = (file: File) => {
    return new Observable((observer: Observer<boolean>) => {
      const isJPG = file.type === 'image/jpeg'
      if (!isJPG) {
        this.msg.error('You can only upload JPG file!')
        observer.complete()
        return
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.msg.error('Image must be smaller than 2MB!')
        observer.complete()
        return
      }
      // check height
      this.checkImageDimension(file).then(dimensionRes => {
        if (!dimensionRes) {
          this.msg.error('Image must be square and 300x300 above')
          observer.complete()
          return
        }

        observer.next(isJPG && isLt2M && dimensionRes)
        observer.complete()
      })
    })
  }

  private getBase64(img: File, callback: (img: string) => void): void {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result!.toString()))
    reader.readAsDataURL(img)
  }

  private checkImageDimension(file: File): Promise<boolean> {
    return new Promise(resolve => {
      const img = new Image() // create image
      img.src = window.URL.createObjectURL(file)
      img.onload = () => {
        const width = img.naturalWidth
        const height = img.naturalHeight
        window.URL.revokeObjectURL(img.src!)
        resolve(width === height && width >= 300)
      }
    })
  }

  handleChange(info: { file: UploadFile }): void {
    switch (info.file.status) {
      case 'uploading':
        this.loading = true
        break
      case 'done':
        // Get this url from response in real world.
        this.getBase64(info.file!.originFileObj!, (img: string) => {
          this.loading = false
          this.avatarUrl = img
        })
        break
      case 'error':
        this.msg.error('Network error')
        this.loading = false
        break
    }
  }

  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl
    this.previewVisible = true
  }

  handleUpload(): void {
    const formData = new FormData()
    const file: File = this.fileList[0].originFileObj
    formData.append('avatar', file)
    this.user.setAvatar(formData).subscribe(res => {
      if (res.success) {
        this.msg.success('Your avatar has been successfully saved!')
      } else {
        this.msg.error(res.message)
      }
    })
  }

  reset(): void {
    console.log("reset")
  }

}
