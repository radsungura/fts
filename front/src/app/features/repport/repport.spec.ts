import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Repport } from './repport';

describe('Repport', () => {
  let component: Repport;
  let fixture: ComponentFixture<Repport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Repport]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Repport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
