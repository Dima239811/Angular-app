import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private openModalSubject = new Subject<string>();
  openModal$ = this.openModalSubject.asObservable();

  open(modalId: string) { 
    console.log(`Attempting to open modal in service: ${modalId}`);
    this.openModalSubject.next(modalId);
  }

  constructor(private router: Router) {}
  checkAndRedirect() {
    const currentUrl = this.router.url;
    console.log(`Current URL: ${currentUrl}`);

    if (currentUrl.includes('/error')) {
      this.router.navigate(['/profile']);
    }
  }

  checkAfterExit() {
    const currentUrl = this.router.url;

    if (currentUrl.includes('/profile')) {
      this.router.navigate(['/error']);
    }
  }
}
