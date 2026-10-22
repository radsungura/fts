import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {Serv} from'../../models/interfaces'
@Injectable({
  providedIn: 'root',
})
export class ServService {
      // private api = 'http://localhost:4000/borrow';
  private readonly api = `${environment.URL}/services`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Serv[]> {
    return this.http.get<Serv[]>(this.api);
  }

  create(doc: Serv): Observable<Serv> {
    return this.http.post<Serv>(this.api, doc);
  }

  delete(id: any): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }

  update(id: any, doc: Serv): Observable<Serv> {
    return this.http.put<Serv>(`${this.api}/${id}`, doc);
  }
}
