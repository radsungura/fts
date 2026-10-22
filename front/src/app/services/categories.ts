import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {Cat} from '../../models/interfaces'


@Injectable({
  providedIn: 'root',
})
export class CatService{
      // private api = 'http://localhost:4000/categories';
  private readonly api = `${environment.URL}/categories`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Cat[]> {
    return this.http.get<Cat[]>(this.api);
  }

  create(doc: Cat): Observable<Cat> {
    return this.http.post<Cat>(this.api, doc);
  }

  delete(id: any): Observable<void> {
    console.log(id);
    
    return this.http.delete<void>(`${this.api}/${id}`);
  }

  update(id: any, doc: Cat): Observable<Cat> {
    return this.http.put<Cat>(`${this.api}/${id}`, doc);
  }
}
