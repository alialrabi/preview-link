/* eslint-disable @typescript-eslint/no-array-constructor */
/* eslint-disable object-shorthand */
/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/tslint/config */
/* eslint-disable no-var */
/* eslint-disable no-console */
import { Component, OnInit, HostListener } from '@angular/core';
import { HttpResponse, HttpClient } from '@angular/common/http';
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
  isSaving = false;
  link: any;
  previews?: IPreview[];
  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.maxLength(50)]],
    pastedlink: [null, [Validators.maxLength(10000)]],
  });

  constructor(
    protected http: HttpClient,
    protected contentService: ContentService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const myElement: HTMLElement | null = document.getElementById('box');
    if (myElement) {
      myElement.contentEditable = 'true';
    }
    this.previews = new Array();
    this.activatedRoute.data.subscribe(({ content }) => {
      this.updateForm(content);
    });
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
      this.subscribeToSaveResponse(this.contentService.create(content));
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
