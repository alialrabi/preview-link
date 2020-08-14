/* eslint-disable @typescript-eslint/no-array-constructor */
/* eslint-disable object-shorthand */
/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/tslint/config */
/* eslint-disable no-var */
/* eslint-disable no-console */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IContent } from 'app/shared/model/content.model';
import { ContentService } from 'app/entities/content/content.service';
import { IPreview } from 'app/shared/model/preview.model';

@Component({
  selector: 'jhi-content-detail',
  templateUrl: './content-detail.component.html',
})
export class ContentDetailComponent implements OnInit {
  content: IContent | null = null;
  previews?: IPreview[];
  constructor(protected activatedRoute: ActivatedRoute, protected contentService: ContentService) {}

  ngOnInit(): void {
    this.previews = new Array();
    this.activatedRoute.data.subscribe(({ content }) => {
      this.content = content;
      if (content.pastedlink) {
        if (this.isUrl(content.pastedlink)) {
          this.getPreview(content.pastedlink);
        }
      }
    });
  }

  downloadFile() {
    this.contentService.getFile(this.content?.id).subscribe(
      data => {
        const link = document.createElement('a');
        link.setAttribute('target', '_blank');
        link.setAttribute('href', `http://localhost:9000/api/contents/files/${this.content?.id}`);
        link.setAttribute('download', `${this.content?.fileName}`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        // console.log('downloaded');
        // const blob = new Blob([data], {type: 'text/json; charset=utf-8'});
        // const url = window.URL.createObjectURL(blob);
        // window.open(url);
      },
      error => {
        console.log('error occurred');
      }
    );
  }

  isUrl(url: string): boolean {
    const regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    return regexp.test(url);
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

  previousState(): void {
    window.history.back();
  }
}
