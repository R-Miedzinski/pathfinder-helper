import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBackgroundComponent } from './add-background.component';

describe('AddBackgroundComponent', () => {
  let component: AddBackgroundComponent;
  let fixture: ComponentFixture<AddBackgroundComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddBackgroundComponent]
    });
    fixture = TestBed.createComponent(AddBackgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
