import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBorrow } from './add-borrow';

describe('AddBorrow', () => {
  let component: AddBorrow;
  let fixture: ComponentFixture<AddBorrow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBorrow]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBorrow);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
