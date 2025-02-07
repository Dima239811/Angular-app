import { Component, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventEmitter } from '@angular/core';
import {NgSwitch, NgSwitchCase, NgSwitchDefault} from "@angular/common";

@Component({
  selector: 'app-but-index',
  standalone: true,
  imports: [
    CommonModule, 
    NgSwitch, 
    NgSwitchCase, 
    NgSwitchDefault
  ],
  templateUrl: './but-index.component.html',
  styleUrl: './but-index.component.scss'
})
export class ButIndexComponent {
   @Input() text!: string;
   @Input() flagFormBut!: number;
   @Output() buttonClick = new EventEmitter<string>(); 
   
    onClick() {
      this.buttonClick.emit(); 
    }
}
