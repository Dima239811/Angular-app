import { Component, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FieldComponent } from '../../common-ui/field/field.component';
import { ButIndexComponent } from '../../common-ui/but-index/but-index.component';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { EventEmitter } from '@angular/core';
@Component({
  selector: 'app-reset',
  standalone: true,
  imports: 
    [
      CommonModule, 
      FieldComponent, 
      ButIndexComponent,
      ReactiveFormsModule,
    ],
  templateUrl: './reset.component.html',
  styleUrl: './reset.component.scss'
})
export class ResetComponent {
  Textholder: string [] = ["Номер"];
  Id: string[] = ["num"]; 
  text: string [] = ["Отменить услугу", "Выполнить услугу", "Возобновить услугу"];
  type: string [] = ["number"];
  isOpen: boolean = false;
  buttons: number = 1;
  @Input() status!: string
  @Input() actionType!: 'cancel' | 'execute' | 'resume';
  @Output() buttonClickCancelOrder = new EventEmitter<string>(); 

  open(status: string) {
    this.isOpen = true;
    this.status = status
    if(status === 'отменен')
      this.actionType = 'cancel';
    else if(status === 'выполнен')
      this.actionType = 'execute';
    else if(status === 'подтвержден')
      this.actionType = 'resume';
  }

  close() {
    this.isOpen = false;
  }

  onButtonClick() {
    this.buttonClickCancelOrder.emit(this.status);
    this.close();
  }

}
