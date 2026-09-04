import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsBorrow } from './details-borrow';

describe('DetailsBorrow', () => {
  let component: DetailsBorrow;
  let fixture: ComponentFixture<DetailsBorrow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsBorrow]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsBorrow);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
