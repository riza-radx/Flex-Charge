import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllCharginhHistoryComponent } from './all-charginh-history.component';

describe('AllCharginhHistoryComponent', () => {
  let component: AllCharginhHistoryComponent;
  let fixture: ComponentFixture<AllCharginhHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllCharginhHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllCharginhHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
