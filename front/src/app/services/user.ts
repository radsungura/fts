import { Injectable } from '@angular/core';
import {User} from '../../models/interfaces'
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
    private api = 'http://localhost:4000/users';
  constructor(private http: HttpClient) {}

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.api);
  }

  create(User: User): Observable<User> {
    return this.http.post<User>(this.api, User);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }

  update(id: number, User: User): Observable<User> {
    return this.http.put<User>(`${this.api}/${id}`, User);
  }
}
