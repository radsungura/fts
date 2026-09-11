import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Location } from '../../models/interfaces';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class Repo {
  // private readonly api = `http://localhost:4000/repos`;
  private readonly api = `${environment.URL}/repos`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Location[]> {
    return this.http.get<Location[]>(this.api);
  }

  getById(id: number): Observable<Location> {
    return this.http.get<Location>(`${this.api}/${id}`);
  }

  create(Location: Location): Observable<Location> {
    return this.http.post<Location>(this.api, Location);
  }

  update(id: number, Location: Location): Observable<Location> {
    return this.http.put<Location>(`${this.api}/${id}`, Location);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}
