import { Injectable } from '@angular/core';
import {Mov} from '../../models/interfaces'
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Borrows {
    private api = 'http://localhost:4000/borrow';
  constructor(private http: HttpClient) {}

  getAll(): Observable<Mov[]> {
    return this.http.get<Mov[]>(this.api);
  }

  create(doc: Mov): Observable<Mov> {
    return this.http.post<Mov>(this.api, doc);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }

  update(id: any, doc: Mov): Observable<Mov> {
    return this.http.put<Mov>(`${this.api}/${id}`, doc);
  }
}
