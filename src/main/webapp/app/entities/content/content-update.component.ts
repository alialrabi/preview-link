/* eslint-disable @typescript-eslint/no-array-constructor */
/* eslint-disable object-shorthand */
/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/tslint/config */
/* eslint-disable no-var */
/* eslint-disable no-console */
import { Component, OnInit, HostListener } from '@angular/core';
import { HttpResponse, HttpClient, HttpEventType } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { IContent, Content } from '../../shared/model/content.model';
import { ContentService } from './content.service';
import { match } from 'assert';
import { IPreview } from '../../shared/model/preview.model';

declare var $: any;

@Component({
  selector: 'jhi-content-update',
  templateUrl: './content-update.component.html',
})
export class ContentUpdateComponent implements OnInit {
  message = '';
  selectedFiles!: FileList;
  currentFile!: File;
  fileInfos!: any;
  photo!: any;
  isImageLoading!: boolean;
  progress = 0;
  isSaving = false;
  link: any;
  previews?: IPreview[];
  imageURL?: string;
  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.maxLength(50)]],
    pastedlink: [null, [Validators.maxLength(10000)]],
    avatar: [null],
    fileUpload: [''],
  });

  constructor(
    protected http: HttpClient,
    protected contentService: ContentService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.fileInfos = new Array();
    const myElement: HTMLElement | null = document.getElementById('box');
    if (myElement) {
      myElement.contentEditable = 'true';
    }
    this.previews = new Array();
    this.activatedRoute.data.subscribe(({ content }) => {
      this.updateForm(content);
    });
    // this.contentService.getFiles().subscribe(
    //   res => {
    //     this.fileInfos.push(res);
    //     console.log(this.fileInfos);
    //   }
    // );
  }

  // Image Preview
  showPreview(event: any) {
    this.currentFile = (event.target as HTMLInputElement).files?.[0]!;
    // this.editForm.patchValue({
    //   avatar: file
    // })
    // this.editForm.get('avatar').updateValueAndValidity();
    // File preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
    };
    reader.readAsDataURL(this.currentFile);
  }

  selectFile(event: any) {
    this.selectedFiles = event.target.files;
  }

  getFileUploaded(id: any) {
    this.isImageLoading = true;
    this.contentService.getFile(id).subscribe(
      data => {
        this.createImageFromBlob(data);
        this.isImageLoading = false;
      },
      error => {
        this.isImageLoading = false;
      }
    );
  }

  createImageFromBlob(image: Blob) {
    const reader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        this.photo = reader.result;
      },
      false
    );

    if (image) {
      if (image.type !== 'application/pdf') reader.readAsDataURL(image);
    }
  }

  // downloadFile(){
  //   const link = document.createElement('a');
  //   link.setAttribute('target', '_blank');
  //   link.setAttribute('href', 'http://localhost:9000/api/file/files/9792151a-183d-45da-9cd4-38fa8b1404dc');
  //   link.setAttribute('download', 'file_name.pdf');
  //   document.body.appendChild(link);
  //   link.click();
  //   link.remove();
  // }

  upload() {
    this.progress = 0;
    this.currentFile = this.selectedFiles.item(0)!;
    this.contentService.upload(this.currentFile).subscribe(
      res => {
        if (res.type === HttpEventType.UploadProgress) {
          this.progress = Math.round((100 * res.loaded) / res.total);
          this.photo = res.body;
          console.log('=============>', this.photo);
          // this.getFileUploaded(res.body.id);
          // this.createImageFromBlob(res.body.data);
        } else if (res instanceof HttpResponse) {
          this.message = res.body.message;
          // this.getFileUploaded(res.body.id);
          this.photo = res.body;
          console.log('-------->', this.photo);
          // this.createImageFromBlob(res.body.data);
          // this.fileInfos.push(res.body);
        }
      },
      err => {
        this.progress = 0;
        this.message = 'Could not upload the file!';
        this.currentFile = undefined!;
      }
    );
    this.selectedFiles = undefined!;
  }

  @HostListener('paste', ['$event'])
  onPaste($event: any): void {
    if (this.isUrl($event.clipboardData.getData('text'))) {
      this.getPreview($event.clipboardData.getData('text'));
    }
    // this.previewGen($event.clipboardData.getData('text'))
  }

  getPreview(url: any) {
    this.contentService.getPreview(url).subscribe(
      res => {
        console.log('-----?', res.body);
        this.previews?.push(res.body);
      },
      err => console.error(err)
    );
  }

  isUrl(url: string): boolean {
    const regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    return regexp.test(url);
  }

  getTitle(externalUrl: any) {
    $.ajax({
      url: 'https://api.linkpreview.net',
      dataType: 'jsonp',
      data: { q: externalUrl, key: '9371cf046ddb394e92b474bcaed2502d' },
      success: (response: any) => {
        console.log(response);
        // document.getElementById("test").innerHTML += "success";
        var matches = response.match(/<title>(.*?)<\/title>/);
        alert(match[1]);
        return matches[1];
      },
    });
  }

  urlifyAndDisplayTitle() {
    var text = this.link;
    var url = this.isUrl(text);
    var title = "<a href = '" + url + "'>" + this.getTitle(url) + '<a>';
    var newText = text.replace(url, title);
    // document.getElementById("test").innerHTML = newText;
  }

  updateForm(content: IContent): void {
    this.editForm.patchValue({
      id: content.id,
      name: content.name,
      pastedlink: content.pastedlink,
    });
    if (content.pastedlink) {
      if (this.isUrl(content.pastedlink)) {
        this.getPreview(content.pastedlink);
      }
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const content = this.createFromForm();
    if (content.id !== undefined) {
      this.subscribeToSaveResponse(this.contentService.update(content));
    } else {
      this.subscribeToSaveResponse(this.contentService.create(content, this.currentFile));
    }
  }

  private createFromForm(): IContent {
    return {
      ...new Content(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      pastedlink: this.editForm.get(['pastedlink'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IContent>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }
}
