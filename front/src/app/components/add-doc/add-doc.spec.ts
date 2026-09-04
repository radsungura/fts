import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDoc } from './add-doc';

describe('AddDoc', () => {
  let component: AddDoc;
  let fixture: ComponentFixture<AddDoc>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddDoc]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDoc);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
