import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Doc } from '../../models/interfaces';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SearchService {
  private api = 'http://localhost:4000/documents';
  documents: Doc[] = [];
  data: any;
  private source = new BehaviorSubject<any[]>([]);
  doc$ = this.source.asObservable();

  constructor(private http: HttpClient){

    this.load();
    this.documents = this.source.value;
  }


  load(){
    this.http.get<Doc[]>(this.api).subscribe( el=> { this.source.next(el) });
  }


  search(query: string): Observable<any[]> {
    // Simuler un filtrage basé sur le nom du médicament
    const results = this.source.value.filter(doc => doc.title.toLowerCase().includes(query.toLowerCase()));
    
    return of(results); // Retourner un Observable
  }

  get_doc(): Observable<any[]>{

    return this.http.get<Doc[]>(this.api);
   
  }
}
