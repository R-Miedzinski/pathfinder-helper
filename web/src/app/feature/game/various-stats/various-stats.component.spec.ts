import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariousStatsComponent } from './various-stats.component';

describe('VariousStatsComponent', () => {
  let component: VariousStatsComponent;
  let fixture: ComponentFixture<VariousStatsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VariousStatsComponent]
    });
    fixture = TestBed.createComponent(VariousStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
