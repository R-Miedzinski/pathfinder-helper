import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguagesInputComponent } from './languages-input.component';

describe('LanguagesInputComponent', () => {
  let component: LanguagesInputComponent;
  let fixture: ComponentFixture<LanguagesInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LanguagesInputComponent]
    });
    fixture = TestBed.createComponent(LanguagesInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
