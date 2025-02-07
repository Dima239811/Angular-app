import { Component, ViewChild, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { RegistrationComponent } from './registration/registration.component';
import { AutorizationComponent } from './autorization/autorization.component';
import { ModalService } from './modal.service';
import { ExitComponent } from './exit/exit.component';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    RegistrationComponent, 
    AutorizationComponent, 
    RouterOutlet, 
    RouterLink, 
    RouterLinkActive,
    ExitComponent,
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent implements OnInit {
  @ViewChild('modalRegistration') modal1!: RegistrationComponent;
  @ViewChild('modalAutorization') modal2!: AutorizationComponent;
  @ViewChild('ExitModal') modal3!: ExitComponent;
  
  constructor(private modalService: ModalService) {}

  ngOnInit() {
    this.modalService.openModal$.subscribe(modalId => {
      console.log(`Attempting to open modal in ngONiNIT: ${modalId}`);
      this.openModal(modalId);
    });
  }

  openModal(modalId: string) {
    if (modalId === 'modalRegistration') {
      console.log(`Attempting to open modal in auth: ${modalId}`);
      this.modal1.open(); 
    } else if (modalId === 'modalAutorization') {
      this.modal2.open();
    }
    else if (modalId === 'ExitModal') {
      this.modal3.open();
    }
  }

  onSwitchToAuth() {
    console.log('Switching to authorization modal');
    this.modal1.close();
    this.modal2.open();
  }

  onSwitchToReg() {
    console.log('Switching to registration modal');
    this.modal2.close();
    this.modal1.open();
  }
}
