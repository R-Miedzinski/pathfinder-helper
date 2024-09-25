import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatChoiceComponent } from './feat-choice.component';

describe('FeatChoiceComponent', () => {
  let component: FeatChoiceComponent;
  let fixture: ComponentFixture<FeatChoiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeatChoiceComponent]
    });
    fixture = TestBed.createComponent(FeatChoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
