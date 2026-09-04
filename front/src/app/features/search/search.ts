import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog   } from '@angular/material/dialog';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DetailsDoc } from '../../components/details-doc/details-doc';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { SearchService } from '../../services/search';
import { firstValueFrom } from 'rxjs';
import { Doc } from "../../../models/interfaces";

@Component({
  selector: 'app-search',
  imports: [FormsModule, MatFormFieldModule, MatToolbarModule, MatIconModule, MatButtonModule, MatDialogModule, CommonModule, MatDialogModule, ReactiveFormsModule, MatInputModule],
  templateUrl: './search.html',
  styleUrl: './search.scss'
})
export class Search {
  results: any;
  query: string = ''; // Valeur saisie dans le champ de recherche
  documents: Doc[] = [];  // Liste des médicaments retournée par la recherche
  isLoading: boolean = false; // Pour gérer l'état de chargement
  searchdoc: any;

  constructor(private serv: SearchService, private dialog: MatDialog, public route: Router) {
    this.getDoc();
    if (this.documents) {
      this.isLoading = true;
    } else {
      this.documents = [];
    }
  }

  getDoc(){
    this.serv.get_doc().subscribe( el => { this.documents = el } );
  }
  // Fonction de recherche rapide 
  autocomplete(query: string) {
    this.query = query? query: '';
    if (query.trim() !== '' && this.query.length > 2) {
      this.isLoading = true;
      this.serv.search(this.query).subscribe(
        (results: any) => {
          this.results = results;
          
          this.isLoading = false;
        },
        (error: any) => {
          console.error('Erreur lors de la recherche', error);
          this.isLoading = false;
        }
      );
    } else {
      this.results = [];
      this.getDoc()
    }
  }
  // reset search
  reset(){
    this.query = "";
    this.searchdoc = "";
  }
  // Fonction de recherche avance
  async search(query: string) {
    this.query = query? query: "";
    if (this.query.trim() !== '') {
       this.isLoading = true;
      try {
        const results = await firstValueFrom(this.serv.search(this.query));
        this.documents = results;
      } catch (error) {
        console.error('Erreur', error);
      } finally {
        this.isLoading = false;
        this.results = [];
        this.query = '';
      }
    } else {
      this.results = [];
    }
  }

  details(doc: any) {
    // Naviguer vers une page ou ouvrir une modale
    const dialogRef = this.dialog.open(DetailsDoc, {
      width: '90vw', // ou '80vw' pour responsive
      maxHeight: '1000vh',
      data: { mode: 'details', item: doc }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.documentsService.addDocument(result).subscribe(() => this.loadDocuments());
      }
    });
  }
}