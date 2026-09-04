import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsDoc } from './details-doc';

describe('DetailsDoc', () => {
  let component: DetailsDoc;
  let fixture: ComponentFixture<DetailsDoc>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsDoc]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsDoc);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
