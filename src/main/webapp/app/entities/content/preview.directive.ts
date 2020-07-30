/* eslint-disable no-useless-escape */
import { HttpClient } from '@angular/common/http';
import { Directive, Input, OnInit, ElementRef, HostListener, Renderer2, AfterViewInit } from '@angular/core';
import { ContentService } from './content.service';

@Directive({
  // tslint:disable-next-line
  selector: '[link-preview]',
})
export class PreviewDirective implements OnInit, AfterViewInit {
  @Input() apiUrl: any;

  @Input() selector: any;

  urlData: any = [];
  link: any;

  ngOnInit(): void {}
  ngAfterViewInit(): void {}

  // eslint-disable-next-line @typescript-eslint/member-ordering
  constructor(private http: HttpClient, private el: ElementRef, private previewService: ContentService, private renderer: Renderer2) {}

  @HostListener('paste', ['$event']) onPaste($event: any): void {
    console.warn('in paste', $event.clipboardData.getData('text'));
    this.previewGen($event.clipboardData.getData('text'));
  }

  public apiCallbackFn = (route: string) => {
    return this.http.get(route);
  };

  previewGen(value: string): void {
    const selctor = this.selector;
    if (this.isUrl(value) && this.apiUrl !== '') {
      this.urlData.title = 'Link Preview';
      this.link = value;
      console.warn(document.querySelector(this.selector));
      document.querySelector(selctor).innerHTML = this._getPopoverCardTpl();
      this.previewService.loadUrlMetadata(value, this.apiUrl);
    }
  }

  _getPopoverCardTpl(): any {
    return `<div class="mdl-card mdl-shadow--8dp popover">
                    <div class="mdl-card__title">
                        <h2 class="mdl-card__title-text">${this.urlData.title}</h2>
                    </div>
                    <div class="popover-content">
                      <ngx-link-preview [apiRoute]='link' [getApiEndpoint$]='apiCallbackFn'></ngx-link-preview>
                      
                    </div>
                </div>`;
  }

  isUrl(url: string): boolean {
    const regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    return regexp.test(url);
  }
}
