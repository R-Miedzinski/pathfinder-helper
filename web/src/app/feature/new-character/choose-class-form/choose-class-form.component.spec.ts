import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseClassFormComponent } from './choose-class-form.component';

describe('ChooseClassFormComponent', () => {
  let component: ChooseClassFormComponent;
  let fixture: ComponentFixture<ChooseClassFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChooseClassFormComponent]
    });
    fixture = TestBed.createComponent(ChooseClassFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
