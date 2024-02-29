import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisorEntidadComponent } from './visor-entidad.component';

describe('VisorEntidadComponent', () => {
  let component: VisorEntidadComponent;
  let fixture: ComponentFixture<VisorEntidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisorEntidadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VisorEntidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
