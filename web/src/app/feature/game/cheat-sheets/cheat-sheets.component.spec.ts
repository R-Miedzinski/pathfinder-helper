import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheatSheetsComponent } from './cheat-sheets.component';

describe('CheatSheetsComponent', () => {
  let component: CheatSheetsComponent;
  let fixture: ComponentFixture<CheatSheetsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CheatSheetsComponent]
    });
    fixture = TestBed.createComponent(CheatSheetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
