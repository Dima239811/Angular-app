import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  private isAdmin = false;
  private authStatusSubject = new BehaviorSubject<boolean>(this.isAuthenticated);
  private adminStatusSubject = new BehaviorSubject<boolean>(this.isAdmin); 

  constructor() {
    const storedUser  = window.localStorage.getItem('user');
    if (storedUser ) {
      const user = JSON.parse(storedUser );
      this.isAuthenticated = true;
      this.authStatusSubject.next(this.isAuthenticated);

      // Восстанавливаем статус администратора
      this.isAdmin = user.role === 'admin'; 
      this.adminStatusSubject.next(this.isAdmin);
    }
  }

  login (admin: boolean) {
      this.isAuthenticated = true;
      this.authStatusSubject.next(this.isAuthenticated);
      this.isAdmin = admin;
      this.adminStatusSubject.next(this.isAdmin)
  }
  
  logout () {
    this.isAuthenticated = false;
    window.localStorage.clear();
    this.authStatusSubject.next(this.isAuthenticated);
    this.isAdmin = false;
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }

  getAuthStatus() {
    return this.authStatusSubject.asObservable();
  }

  setAdminStatus() {
    this.isAdmin = true;
    this.adminStatusSubject.next(this.isAdmin); // Уведомляем подписчиков об изменении статуса админа
    console.log("Статус админа установлен:", this.isAdmin)
  }

  Admin() {
    console.log("установка статуса адмиина при авторизации в сервисе")
    this.setAdminStatus();
  }

  getAdminStatus() {
    return this.adminStatusSubject.asObservable(); // Метод для получения статуса админа
  }
}
