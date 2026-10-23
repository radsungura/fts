import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCat } from './add-cat';

describe('AddCat', () => {
  let component: AddCat;
  let fixture: ComponentFixture<AddCat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCat]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCat);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
