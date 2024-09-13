import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterDataFormComponent } from './enter-data-form.component';

describe('EnterDataFormComponent', () => {
  let component: EnterDataFormComponent;
  let fixture: ComponentFixture<EnterDataFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EnterDataFormComponent]
    });
    fixture = TestBed.createComponent(EnterDataFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
