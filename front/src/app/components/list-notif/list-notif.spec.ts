import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListNotif } from './list-notif';

describe('ListNotif', () => {
  let component: ListNotif;
  let fixture: ComponentFixture<ListNotif>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListNotif]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListNotif);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
