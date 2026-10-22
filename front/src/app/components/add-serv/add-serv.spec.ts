import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddServ } from './add-serv';

describe('AddServ', () => {
  let component: AddServ;
  let fixture: ComponentFixture<AddServ>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddServ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddServ);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
