import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsNotif } from './details-notif';

describe('DetailsNotif', () => {
  let component: DetailsNotif;
  let fixture: ComponentFixture<DetailsNotif>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsNotif]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsNotif);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
