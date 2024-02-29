import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiVisorEntidadModelo1Component } from './ui-visor-entidad-modelo1.component';

describe('UiVisorEntidadModelo1Component', () => {
  let component: UiVisorEntidadModelo1Component;
  let fixture: ComponentFixture<UiVisorEntidadModelo1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiVisorEntidadModelo1Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UiVisorEntidadModelo1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
