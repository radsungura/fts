import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';

import { DetailsDoc } from '../../components/details-doc/details-doc';
import { SearchService } from '../../services/search';

import { Doc } from '../../../models/interfaces';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatTooltipModule,
  ],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class Search implements OnInit {
  /**
   * Tous les documents / résultats de recherche
   */
  documents: Doc[] = [];

  /**
   * Résultats de l'autocomplétion
   */
  results: Doc[] = [];

  /**
   * Documents affichés sur la page courante
   */
  paginatedDocuments: Doc[] = [];

  /**
   * Texte saisi dans la barre de recherche
   */
  searchdoc = '';

  /**
   * Requête actuelle
   */
  query = '';

  /**
   * État du chargement
   */
  isLoading = false;

  /**
   * Pagination
   */
  pageSize = 10;
  pageIndex = 0;

  constructor(
    private serv: SearchService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.getDoc();
  }

  /**
   * Charger tous les documents
   */
  getDoc(): void {
    this.isLoading = true;

    this.serv.get_doc().subscribe({
      next: (documents: Doc[]) => {
        this.documents = documents;

        this.pageIndex = 0;

        this.updatePagination();

        this.isLoading = false;
      },

      error: (error) => {
        console.error('Erreur lors du chargement des documents :', error);

        this.documents = [];
        this.paginatedDocuments = [];

        this.isLoading = false;
      },
    });
  }

  /**
   * Autocomplétion
   *
   * La recherche commence à partir de 3 caractères.
   */
  autocomplete(query: string): void {
    this.searchdoc = query;
    this.query = query.trim();

    if (this.query.length >= 3) {
      this.isLoading = true;

      this.serv.search(this.query).subscribe({
        next: (results: Doc[]) => {
          this.results = results;

          this.isLoading = false;
        },

        error: (error) => {
          console.error('Erreur lors de la recherche :', error);

          this.results = [];

          this.isLoading = false;
        },
      });
    } else {
      this.results = [];

      /*
       * Si le champ est complètement vide,
       * on revient à la liste complète.
       */
      if (this.query.length === 0) {
        this.getDoc();
      }
    }
  }

  /**
   * Recherche complète
   */
  search(query: string): void {
    const searchValue = query.trim();

    if (!searchValue) {
      this.reset();
      return;
    }

    this.searchdoc = searchValue;
    this.query = searchValue;

    this.isLoading = true;

    this.serv.search(searchValue).subscribe({
      next: (results: Doc[]) => {
        /*
         * Les résultats deviennent
         * la nouvelle liste à paginer.
         */
        this.documents = results;

        /*
         * On masque l'autocomplétion.
         */
        this.results = [];

        /*
         * Toujours revenir à la première page
         * après une nouvelle recherche.
         */
        this.pageIndex = 0;

        this.updatePagination();

        this.isLoading = false;
      },

      error: (error) => {
        console.error('Erreur lors de la recherche :', error);

        this.documents = [];
        this.paginatedDocuments = [];
        this.results = [];

        this.isLoading = false;
      },
    });
  }

  /**
   * Réinitialiser la recherche
   */
  reset(): void {
    this.searchdoc = '';
    this.query = '';
    this.results = [];

    this.pageIndex = 0;

    this.getDoc();
  }

  /**
   * Changer de page
   */
  changePage(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    this.updatePagination();
  }

  /**
   * Calculer les documents à afficher
   * sur la page courante.
   */
  updatePagination(): void {
    const startIndex = this.pageIndex * this.pageSize;

    const endIndex = startIndex + this.pageSize;

    this.paginatedDocuments = this.documents.slice(startIndex, endIndex);
  }

  /**
   * Afficher les détails du document
   */
  details(doc: Doc): void {
    this.dialog.open(DetailsDoc, {
      width: '90vw',
      maxWidth: '700px',
      maxHeight: '90vh',
      data: {
        mode: 'details',
        item: doc,
      },
    });
  }
}
