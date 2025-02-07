import { Component } from '@angular/core';
import { HeaderComponent } from '../../common-ui/header/header.component';
import { FooterComponent } from '../../common-ui/footer/footer.component';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { ButIndexComponent } from '../../common-ui/but-index/but-index.component';
import { AuthComponent } from '../../auth/auth.component';
import { ModalService } from '../../auth/modal.service';

@Component({
  selector: 'app-error-page',
  standalone: true,
  imports: [
            HeaderComponent,
            FooterComponent, 
            ButIndexComponent, 
            AuthComponent,
            RouterOutlet, 
            RouterLink, 
            RouterLinkActive
  ],
  templateUrl: './error-page.component.html',
  styleUrl: './error-page.component.scss'
})
export class ErrorPageComponent {
  textBut: string [] = ["Войти", "Регистрация"];
  numBut: number [] = [6, 7];

  constructor(private modalService: ModalService) {}

  openModal(event: Event, modalId: string) {
    event.preventDefault(); 
    console.log(`Attempting to open modal in header: ${modalId}`);
    this.modalService.open(modalId); 
  }

}
