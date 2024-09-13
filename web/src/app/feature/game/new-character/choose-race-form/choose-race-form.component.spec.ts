import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseRaceFormComponent } from './choose-race-form.component';

describe('ChooseRaceFormComponent', () => {
  let component: ChooseRaceFormComponent;
  let fixture: ComponentFixture<ChooseRaceFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChooseRaceFormComponent]
    });
    fixture = TestBed.createComponent(ChooseRaceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
