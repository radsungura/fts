import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsRole } from './details-role';

describe('DetailsRole', () => {
  let component: DetailsRole;
  let fixture: ComponentFixture<DetailsRole>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsRole]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsRole);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
