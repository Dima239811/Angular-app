import { Component, ViewChild} from '@angular/core';
import { RegistrationComponent } from '../../auth/registration/registration.component';
import { AutorizationComponent } from '../../auth/autorization/autorization.component'
import { AuthComponent } from '../../auth/auth.component';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../auth/modal.service';
import { AuthService } from '../../shared/services/auth.service';
import { ExitComponent } from '../../auth/exit/exit.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
            RegistrationComponent,
            AutorizationComponent,
            RouterOutlet,
            RouterLink,
            RouterLinkActive, 
            CommonModule,
            AuthComponent,
            ExitComponent,
          ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
 
  constructor(private router: Router, private modalService: ModalService, private authservice: AuthService) {}

  public isAuth: boolean = false;
  
  ngOnInit() {
    // Подписка на изменения состояния аутентификации
    this.authservice.getAuthStatus().subscribe(authStatus => {
      this.isAuth = authStatus;
    });
  }
  
  openModal(event: Event, modalId: string) {
    event.preventDefault(); 
    console.log(`Attempting to open modal in header: ${modalId}`);
    this.modalService.open(modalId); 
  }

  tryOpenModal(event: Event) {
    if (this.isAuth) {
      this.openModal(event, 'ExitModal')
    }
    else {
      this.openModal(event, 'modalRegistration')
    }
  }

  navigateToSection(sectionId: string): void {
    const currentUrl = this.router.url;

    if (currentUrl === '/') {
      // Если на главной странице, прокручиваем к якорю
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Если на другой странице, переходим на главную и прокручиваем к якорю
      this.router.navigate(['/']).then(() => {
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }
}
