import { Injectable } from '@angular/core';
import {Doc} from '../../models/interfaces'
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Document {

  private api = 'http://localhost:4000/documents';
  constructor(private http: HttpClient) {}

  getAll(): Observable<Doc[]> {
    return this.http.get<Doc[]>(this.api);
  }

  create(doc: Doc): Observable<Doc> {    
    return this.http.post<Doc>(this.api, doc);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }

  update(id: any, doc: Doc): Observable<Doc> {
    return this.http.put<Doc>(`${this.api}/${id}`, doc);
  }
}
