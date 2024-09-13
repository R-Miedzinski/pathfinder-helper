import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseBackgroundFormComponent } from './choose-background-form.component';

describe('ChooseBackgroundFormComponent', () => {
  let component: ChooseBackgroundFormComponent;
  let fixture: ComponentFixture<ChooseBackgroundFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChooseBackgroundFormComponent]
    });
    fixture = TestBed.createComponent(ChooseBackgroundFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
