import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoostChoiceComponent } from './boost-choice.component';

describe('BoostChoiceComponent', () => {
  let component: BoostChoiceComponent;
  let fixture: ComponentFixture<BoostChoiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BoostChoiceComponent]
    });
    fixture = TestBed.createComponent(BoostChoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
