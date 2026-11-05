import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Role } from '../../models/interfaces';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
// private readonly api = `http://localhost:4000/repos`;
  private readonly api = `${environment.URL}/roles`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Role[]> {
    return this.http.get<Role[]>(this.api);
  }

  getById(id: number): Observable<Role> {
    return this.http.get<Role>(`${this.api}/${id}`);
  }

  create(Location: Location): Observable<Role> {
    return this.http.post<Role>(this.api, Location);
  }

  update(id: any, Location: Location): Observable<Role> {
    return this.http.put<Role>(`${this.api}/${id}`, Location);
  }

  delete(id: any): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}
