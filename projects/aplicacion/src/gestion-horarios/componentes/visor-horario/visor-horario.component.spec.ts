import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisorHorarioComponent } from './visor-horario.component';

describe('VisorHorarioComponent', () => {
  let component: VisorHorarioComponent;
  let fixture: ComponentFixture<VisorHorarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisorHorarioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VisorHorarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
