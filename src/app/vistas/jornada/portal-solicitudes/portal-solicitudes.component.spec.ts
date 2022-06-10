import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalSolicitudesComponent } from './portal-solicitudes.component';

describe('PortalSolicitudesComponent', () => {
  let component: PortalSolicitudesComponent;
  let fixture: ComponentFixture<PortalSolicitudesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PortalSolicitudesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PortalSolicitudesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
