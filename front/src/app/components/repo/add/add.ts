import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { Location } from '../../../../models/interfaces';
import { Repo } from '../../../services/repo';

@Component({
  selector: 'app-add',
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
  ],
  templateUrl: './add.html',
  styleUrl: './add.scss',
})
export class Add {
  servererror = false;
  parents: any = [];
  level: any;
  form;
  parent: any;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<Add>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private serv: Repo,
  ) {
    const location = data?.data;

    console.log('Add component data:', location);

    this.form = this.fb.group({
    const location = data?.data;
    this.form = this.fb.group({
      name: [location?.name ?? '', Validators.required],
      code: [location?.code ?? '', Validators.required],
      category: [location?.category ?? '', Validators.required],
      address: [location?.address ?? ''],
      desc: [location?.desc ?? '', Validators.required],
      parent_id: [location?.parent_id ?? ''],
      status: [location?.status ?? 'Actif', Validators.required],
      created_at: [location?.status ?? Date.now, Validators.required],
      update_at: [location?.status ?? Date.now, Validators.required],
    });

    this.serv.getAll().subscribe(el =>{
      this.parent = el;
    });
  }

  oncat(data: any): void {
    this.serv.getAll().subscribe((locations: Location[]) => {
      this.parents = locations.filter((el) => el.category == (parseInt(data) - 1));
      console.log('parents', this.parents, locations.map((el) => el.category), parseInt(data) - 1);
    });
  }

  onSubmit(): void {
    this.servererror = false;
    
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const locationData = this.form.getRawValue() as Location;
    console.log("data", locationData, this.form.getRawValue(), this.data);
    
    if (this.data.action === 'add') {
      this.add(locationData);
    } else {
      this.edit(locationData);
    }
  }

  add(location: any): void {
    location.address = (parseInt(location.category) > 1)? this.getLocation(location.parent_id) : location.address;
    this.serv.create(location).subscribe({
      next: (result: any) => {
        this.dialogRef.close(result);
      },
      error: (error) => {
        console.error('Erreur lors de l’ajout du location :', error);
        this.servererror = true;
      },
    });
  }

  edit(location: Location): void {
    location.address = (location.category > 1)? this.getLocation(location.parent_id) : location.address;
    const id = this.data?.data?.id;
    if (!id) {
      console.error('ID du location manquant');
      this.servererror = true;
      return;
    }
    this.serv.update(id, location).subscribe({
      next: (result: Location) => {
        this.dialogRef.close(result);
      },

      error: (error) => {
        console.error('Erreur lors de la modification du location :', error);

        this.servererror = true;
      },
    });
  }

  getLocation(id: any){
    let location: any = "";
    const box = this.parent.find((b: any) => b.id == id);
    const bay = this.parent.find((el: any) => el.id === box?.parent_id);
    const shelf = this.parent.find((s: any) => s.id === bay?.parent_id);
    const range = this.parent.find((r: any) => r.id === shelf?.parent_id);
    const room = this.parent.find((r: any) => r.id === range?.parent_id);
    const site = this.parent.find((s: any) => s.id === room?.parent_id);
    const path = [box, bay, shelf, range, room, site];
    path.forEach(el => {
      location += el?.name? `  >  ${el.name} ` : '';
    });
    return location;
  }

  cancel(): void {
    this.dialogRef.close();
  }

}
