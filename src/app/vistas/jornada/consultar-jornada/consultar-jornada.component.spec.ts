import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarJornadaComponent } from './consultar-jornada.component';

describe('ConsultarJornadaComponent', () => {
  let component: ConsultarJornadaComponent;
  let fixture: ComponentFixture<ConsultarJornadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultarJornadaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultarJornadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
