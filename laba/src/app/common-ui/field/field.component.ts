import { Component, Input, forwardRef } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormGroup } from '@angular/forms';
import { ControlContainer, FormGroupDirective } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-field',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ],
  templateUrl: './field.component.html',
  styleUrl: './field.component.scss'
})

export class FieldComponent {
  @Input() textHolder!: string; 
  @Input() id!: string;
  @Input() type!: string;
  @Input() controlName!: string;
}
