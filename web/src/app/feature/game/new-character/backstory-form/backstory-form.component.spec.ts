import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackstoryFormComponent } from './backstory-form.component';

describe('BackstoryFormComponent', () => {
  let component: BackstoryFormComponent;
  let fixture: ComponentFixture<BackstoryFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BackstoryFormComponent]
    });
    fixture = TestBed.createComponent(BackstoryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
