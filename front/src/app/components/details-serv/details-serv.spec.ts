import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsServ } from './details-serv';

describe('DetailsServ', () => {
  let component: DetailsServ;
  let fixture: ComponentFixture<DetailsServ>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsServ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsServ);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
