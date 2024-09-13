import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainCharacterPageComponent } from './main-character-page.component';

describe('MainCharacterPageComponent', () => {
  let component: MainCharacterPageComponent;
  let fixture: ComponentFixture<MainCharacterPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainCharacterPageComponent]
    });
    fixture = TestBed.createComponent(MainCharacterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
