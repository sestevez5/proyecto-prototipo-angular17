import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiVisorHorarioModelo1Component } from './ui-visor-horario-modelo1.component';

describe('UiVisorHorarioModelo1Component', () => {
  let component: UiVisorHorarioModelo1Component;
  let fixture: ComponentFixture<UiVisorHorarioModelo1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiVisorHorarioModelo1Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UiVisorHorarioModelo1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
