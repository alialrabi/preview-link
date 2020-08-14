/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IContent } from 'app/shared/model/content.model';

type EntityResponseType = HttpResponse<IContent>;
type EntityArrayResponseType = HttpResponse<IContent[]>;

@Injectable({ providedIn: 'root' })
export class ContentService {
  public resourceUrl = SERVER_API_URL + 'api/contents';
  public resourceFileUrl = SERVER_API_URL + 'api/file';

  constructor(protected http: HttpClient) {}

  getPreview(url: string): Observable<any> {
    let data = { key: '9371cf046ddb394e92b474bcaed2502d', q: url };
    return this.http.post('https://api.linkpreview.net', JSON.stringify(data), { observe: 'response' });
  }

  upload(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    const request = new HttpRequest('POST', `${this.resourceFileUrl}/upload`, formData, {
      reportProgress: true,
      responseType: 'json',
    });
    // return this.http.request(request);
    return this.http.post(`${this.resourceFileUrl}/upload`, formData, { reportProgress: true, observe: 'response', responseType: 'json' });
  }

  getFiles(): Observable<any> {
    return this.http.get<any>(`${this.resourceFileUrl}/files`);
  }

  getFile(id: any): Observable<File> {
    // let result: Observable<any> = this.http.get(`${this.resourceFileUrl}/files/${id}` , {responseType: 'blob'});
    let result: Observable<any> = this.http.get(`${this.resourceUrl}/files/${id}`, { responseType: 'blob' });
    return result;
  }

  create(content: IContent, file: File): Observable<EntityResponseType> {
    const formData = new FormData();
    formData.append('content', JSON.stringify(content));
    formData.append('file', file);
    return this.http.post<IContent>(this.resourceUrl, formData, { observe: 'response' });
  }

  update(content: IContent): Observable<EntityResponseType> {
    return this.http.put<IContent>(this.resourceUrl, content, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IContent>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IContent[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  loadUrlMetadata(url: any, apiUrl: any): void {
    console.warn('load', url, apiUrl);
  }
}
