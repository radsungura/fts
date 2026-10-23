import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsCat } from './details-cat';

describe('DetailsCat', () => {
  let component: DetailsCat;
  let fixture: ComponentFixture<DetailsCat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsCat]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsCat);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
