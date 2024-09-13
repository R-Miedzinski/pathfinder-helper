import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCharacterComponent } from './new-character.component';

describe('NewCharacterComponent', () => {
  let component: NewCharacterComponent;
  let fixture: ComponentFixture<NewCharacterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewCharacterComponent]
    });
    fixture = TestBed.createComponent(NewCharacterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
