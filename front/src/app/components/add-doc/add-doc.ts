import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { Doc } from '../../../models/interfaces';
import { Location } from '../../../models/interfaces';
import { Document } from '../../services/document';
import { Repo } from '../../services/repo';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'app-add-doc',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatAutocompleteModule,
  ],
  templateUrl: './add-doc.html',
  styleUrl: './add-doc.scss',
})
export class AddDoc {
  servererror = false;
  sites: Location[] = [];
  rooms: Location[] = [];
  ranges: Location[] = [];
  shelves: Location[] = [];
  bays: Location[] = [];
  boxs: Location[] = [];
  children: Location[] = [];
  location: Location[] = [];
  newBox: boolean = false;
  box: any;
  parent: any;
  site: any;
  room: any;
  range: any;
  shelf: any;
  bay: any;
  form;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddDoc>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private serv: Document, private repos: Repo
  ) {
    const doc = data?.data;
    this.repos.getAll().subscribe(rep => 
      {
        this.location = rep;
        this.sites = rep.filter(el => el.category == 1);
        this.rooms = rep.filter(el => el.category == 2);
        this.ranges = rep.filter(el => el.category == 3);
        this.shelves = rep.filter(el => el.category == 4);
        this.bays = rep.filter(el => el.category == 5);
        this.boxs = rep.filter(el => el.category == 6);
      }
    );

    this.form = this.fb.group({
      title: [doc?.title ?? '', Validators.required],
      reference: [doc?.reference ?? '', Validators.required],
      category: [doc?.category ?? '', Validators.required],
      location: [doc?.location ?? ''],
      desc: [doc?.desc ?? ''],
      box_id: [doc?.box_id ?? '', Validators.required],
      bay: [doc?.bay ?? ''],
      shelf: [doc?.shelf ?? ''],
      range: [doc?.range ?? ''],
      room: [doc?.room ?? ''],
      site: [doc?.site ?? ''],
      dept_id: [doc?.dept_id ?? ''],
      code: [doc?.code ?? ''],
      updated_by: [doc?.updated_by ?? ''],
      created_by: [doc?.created_by ?? ''],
      created_at: [doc?.created_at ?? Date.now, Validators.required],
      updated_at: [doc?.updated_at ?? Date.now, Validators.required],
      status: [doc?.status ?? 'Actif', Validators.required],
    });
  }

  onSubmit(): void {
    this.servererror = false;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const documentData = this.form.getRawValue();
    if (this.data.action === 'add') {
      this.add(documentData);
    } else {
      this.edit(documentData);
    }
  }

  nextloclevel(item: any){
    console.log("item", item, this.location);

    this.children = this.location.filter(el => el.parent_id == item)? this.location.filter(el => el.parent_id == item) : [];
       
  }

  add(doc: Doc): void {
    // console.log("data", doc);
    if(doc){
      doc.code = doc.dept_id + '-' + doc.reference;
      doc.location = this.getLocation(doc.box_id);
    }
    this.serv.create(doc).subscribe({
      next: (result: Doc) => {
        this.dialogRef.close(result);
        console.log("res", result);
      },

      error: (error) => {
        console.error('Erreur lors de l’ajout du document :', error);
        this.servererror = true;
      },
    });
  }

  edit(doc: Doc): void {
    const id = this.data?.data?.id;

    if (!id) {
      console.error('ID du document manquant');
      this.servererror = true;
      return;
    }
    // console.log("data", doc);  
    if(doc){
      doc.code = doc.dept_id + '-' + doc.reference;
      doc.location = this.getLocation(doc);
    }

    this.serv.update(id, doc).subscribe({
      next: (result: Doc) => {
        this.dialogRef.close(result);
      },

      error: (error) => {
        console.error('Erreur lors de la modification du document :', error);

        this.servererror = true;
      },
    });
  }

  getLocation(doc: any){
    const box = this.boxs.find(b => b.name == doc.box_id);
    const bay = box? this.bays.find(el => el.id === box?.parent_id): this.bays.find(el => el.name ===  doc?.bay);
    const shelf = this.shelves.find(s => s.id === bay?.parent_id);
    const range = this.ranges.find(r => r.id === shelf?.parent_id);
    const room = this.rooms.find(r => r.id === range?.parent_id);
    const site = this.sites.find(s => s.id === room?.parent_id);
    const location = `${site?.name ?? ''} => ${room?.name ?? ''} => ${range?.name ?? ''} => ${shelf?.name ?? ''} => ${bay?.name ?? ''} => ${box?.name ?? ''}`; 
    console.log("loc", doc, box, bay);
    return location;
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
