import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { Cat, Doc } from '../../../models/interfaces';
import { Location } from '../../../models/interfaces';
import { Document } from '../../services/document';
import { Repo } from '../../services/repo';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ServService } from '../../services/services';
import { CatService } from '../../services/categories';

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
  folders: Location[] = [];
  children: Location[] = [];
  location: any[] = [];
  newBox: boolean = false;
  box: any;
  parent: any;
  site: any;
  room: any;
  range: any;
  etag: any;
  bay: any;
  exist: boolean = false;
  form;
  servcs: any[] = [];
  cats: Cat[] = []
  docs: Doc[] = []

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddDoc>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private serv: Document, 
    private repos: Repo,
    private srvc: ServService,
    private cat: CatService,
  ) {
    const doc = data?.data;
    this.repos.getAll().subscribe(rep => {
      this.sites = rep.filter(el => el.category == 1);
      this.rooms = rep.filter(el => el.category == 2);
      this.ranges = rep.filter(el => el.category == 3);
      this.shelves = rep.filter(el => el.category == 4);
      this.bays = rep.filter(el => el.category == 5);
      this.boxs = rep.filter(el => el.category == 6);
      this.folders = rep.filter(el => el.category == 7);
      for (let i = 0; i < this.boxs.length; i++) {
        const box = this.boxs[i];
        this.location.push({
          id: box.id,
          link: this.getLocation(box.id),
        });
      }
    });
    this.srvc.getAll().subscribe(el=>{
      this.servcs = el;
    });
    this.cat.getAll().subscribe(el=>{
      this.cats = el;
    });
    this.serv.getAll().subscribe(el=>{
      this.docs = el;
    })

    this.form = this.fb.group({
      title: [doc?.title ?? '', Validators.required],
      reference: [doc?.reference ?? '', Validators.required],
      category: [doc?.category ?? '', Validators.required],
      owner: [doc?.owner ?? '', Validators.required],
      location: [doc?.location ?? ''],
      desc: [doc?.desc ?? ''],
      box_id: [doc?.box_id ?? '', Validators.required],
      folder: [doc?.folder ?? ''],
      bay: [doc?.bay ?? ''],
      shelf: [doc?.shelf ?? ''],
      range: [doc?.range ?? ''],
      room: [doc?.room ?? ''],
      site: [doc?.site ?? ''],
      dept_id: [doc?.dept_id ?? '', Validators.required],
      code: [doc?.code ?? ''],
      updated_by: [doc?.updated_by ?? ''],
      created_by: [doc?.created_by ?? new Date().toISOString()],
      created_at: [doc?.created_at ?? new Date().toISOString()],
      updated_at: [doc?.updated_at ?? new Date().toISOString()],
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

  onShelfChange(level: string, event: any): void {
    if (level === 'shelf') {
      this.bays = this.bays.filter(s => s.parent_id === event);
    }
    if (level === 'bay') {
      this.boxs = this.boxs.filter(s => s.parent_id === event);
    }
    if (level === 'box') {
      this.folders = this.folders.filter(s => s.parent_id === event);
    }
  }
  add(doc: any): void {
    // console.log("data", doc);
    if(doc){
      doc.code = doc.dept_id + '-' + doc.reference;
      doc.location = this.getLocation(doc.folder);
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

  edit(doc: any): void {
    const id = this.data?.data?.id;
    console.log("data", doc);

    if (!id) {
      console.error('ID du document manquant');
      this.servererror = true;
      return;
    }
    // console.log("data", doc);  
    if(doc){
      doc.code = doc.dept_id + '-' + doc.reference;
      doc.location = this.getLocation(doc.folder);
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

  getLocation(id: any){
    const folder = this.folders.find(f => f.id == id);
    const box = this.boxs.find(b => b.id == folder?.parent_id);
    const bay = this.bays.find(el => el.id === box?.parent_id);
    const shelf = this.shelves.find(s => s.id === bay?.parent_id);
    const range = this.ranges.find(r => r.id === shelf?.parent_id);
    const room = this.rooms.find(r => r.id === range?.parent_id);
    const site = this.sites.find(s => s.id === room?.parent_id);
    const location = `${site?.name ?? ''} / ${room?.name ?? ''} / ${range?.name ?? ''} / ${shelf?.name ?? ''} / ${bay?.name ?? ''} / ${box?.name ?? ''} / ${folder?.name ?? ''}`; 
    return location;
  }

  getLocationData(loc: any){
    const parts = loc.split(' / ').map((s: any) => s.trim());
    const location = [{site : parts[0] ?? ''}, {room : parts[1] ?? ''}, {range : parts[2] ?? ''}, {shelf : parts[3] ?? ''}, {bay : parts[4] ?? ''}, {box : parts[5] ?? ''}]; 
    console.log("location", location);
    // return location;
  }
  checkref(ref: string){
    let exist = this.docs.find(el=> el.reference === ref || el.code === ref);
    this.exist = exist? true : false;
    console.log('data', this.exist)
    return this.exist;
  }
  cancel(): void {
    this.dialogRef.close();
  }
}
