import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestUsuariosJornadasComponent } from './gest-usuarios-jornadas.component';

describe('GestUsuariosJornadasComponent', () => {
  let component: GestUsuariosJornadasComponent;
  let fixture: ComponentFixture<GestUsuariosJornadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestUsuariosJornadasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestUsuariosJornadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
