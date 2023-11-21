import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoAndLicensesComponent } from './info-and-licenses.component';

describe('InfoAndLicensesComponent', () => {
  let component: InfoAndLicensesComponent;
  let fixture: ComponentFixture<InfoAndLicensesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InfoAndLicensesComponent]
    });
    fixture = TestBed.createComponent(InfoAndLicensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
