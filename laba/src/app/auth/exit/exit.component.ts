import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButIndexComponent } from '../../common-ui/but-index/but-index.component';
import { AuthService } from '../../shared/services/auth.service';
import { ModalService } from '../modal.service';

@Component({
  selector: 'app-exit',
  standalone: true,
  imports: [CommonModule, ButIndexComponent],
  templateUrl: './exit.component.html',
  styleUrl: './exit.component.scss'
})
export class ExitComponent {
  isOpen: boolean = false;
  text: string = "Выйти"
  buttons: number = 1;
  constructor(private authservice: AuthService, private modalservice: ModalService) {}

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }

  onButtonClick() {
    this.authservice.logout()
    this.close();
    this.modalservice.checkAfterExit()
  }
}
