import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectorTipoEntidadComponent } from './selector-tipo-entidad.component';

describe('SelectorTipoEntidadComponent', () => {
  let component: SelectorTipoEntidadComponent;
  let fixture: ComponentFixture<SelectorTipoEntidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectorTipoEntidadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectorTipoEntidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
