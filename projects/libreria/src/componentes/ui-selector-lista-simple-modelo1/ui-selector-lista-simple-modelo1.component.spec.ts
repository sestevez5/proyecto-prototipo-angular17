import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiSelectorListaSimpleModelo1Component } from './ui-selector-lista-simple-modelo1.component';

describe('UiSelectorListaSimpleModelo1Component', () => {
  let component: UiSelectorListaSimpleModelo1Component;
  let fixture: ComponentFixture<UiSelectorListaSimpleModelo1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiSelectorListaSimpleModelo1Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UiSelectorListaSimpleModelo1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
