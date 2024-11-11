import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
 
  private baseUrl = 'http://localhost:4700'; 
  constructor(private http: HttpClient) { }

  upload(file: File,id:any): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(`${this.baseUrl}/upload/${id}`, formData);
  }

  getFiles(id: any, searchTerm: string, page: number, itemsPerPage: number): Observable<any> {
    let params = new HttpParams()
      .set('searchTerm', searchTerm)
      .set('page', page.toString())
      .set('limit', itemsPerPage.toString());
    return this.http.get(`${this.baseUrl}/template_list/${id}`,{params});
  }

  getPlaceholder(fp: any):Observable<any>  {
    return this.http.post(`${this.baseUrl}/extract_placeholder`, fp);
  }

  replacePlaceholder(data:any):Observable<any> {
    return this.http.post(`${this.baseUrl}/replace_placeholder`, data);
  }

  getDocument(id: any, searchTerm: string, page: number, itemsPerPage: number): Observable<any> {
    let params = new HttpParams()
      .set('searchTerm', searchTerm)
      .set('page', page.toString())
      .set('limit', itemsPerPage.toString());
    return this.http.get(`${this.baseUrl}/document_list/${id}`,{params});
  }

  pdfToDoc(data:any): Observable<any>{
    return this.http.post(`${this.baseUrl}/convert-pdf-to-doc`, data);
  }
}
