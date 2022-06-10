import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaHorariosComponent } from './tabla-horarios.component';

describe('TablaHorariosComponent', () => {
  let component: TablaHorariosComponent;
  let fixture: ComponentFixture<TablaHorariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TablaHorariosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaHorariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
