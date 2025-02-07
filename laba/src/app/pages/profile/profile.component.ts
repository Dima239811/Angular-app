import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../common-ui/header/header.component';
import { FooterComponent } from '../../common-ui/footer/footer.component';
import { RecordComponent } from '../../forms/record/record.component';
import { ResetComponent } from '../../forms/reset/reset.component';
import { ChangeDataComponent } from '../../forms/change-data/change-data.component';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { TableComponent } from '../../common-ui/table/table.component';
import { ButIndexComponent } from '../../common-ui/but-index/but-index.component';
import { ReactiveFormsModule } from '@angular/forms';
import { User } from '../../shared/models/user.model';
import { UsersService } from '../../shared/services/users.service';
import { Observable, Subscription } from "rxjs";
import { AuthService } from '../../shared/services/auth.service';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
            HeaderComponent, 
            FooterComponent,
            ResetComponent,
            RecordComponent,
            ChangeDataComponent,
            TableComponent,
            ButIndexComponent,
            ReactiveFormsModule,
            CommonModule,
          ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  @ViewChild ('modalRecord') modal1!: RecordComponent;
  @ViewChild ('modalReset') modal2!: ResetComponent;
  @ViewChild ('modalChange') modal3!: ChangeDataComponent;

  textBut: string[] = ["Изменить данные", "Добавить услугу", "Отменить услугу"];
  numBut: number[] = [4, 5];

  openModal(modalId: string) {
    if (modalId === 'modalRecord') {
      this.modal1.open(); 
    } 
    else if (modalId === 'modalChange') {
      console.log("роль пользователя при пердаче в open из профиля", this.role)
      console.log("при открытие модального окна замены данных isadmin = ", this.isadmin)
      this.modal3.open(this.user, this.role);
    }
  }

  isadmin: boolean = false;
  user!: User;
  role!: string;

  constructor(private usersService: UsersService, private authService: AuthService) { }

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      this.user = new User(parsedUser.name, parsedUser.email, parsedUser.password, parsedUser.role || undefined, parsedUser.id);
      console.log("пользователь при попадании на страницу профиля", this.user);

      // Подписываемся на изменения статуса администратора
      this.authService.getAdminStatus().subscribe(isAdmin => {
        this.isadmin = isAdmin;
        console.log("Текущий статус админа в он инит:", this.isadmin);
        if (this.isadmin) {
          this.role = "admin"
        }
      });
    }
}

handleDataChanged(updatedUser: User) {
  console.log("Данные обновлены:", updatedUser);
  this.user = updatedUser; // Обновляем пользователя в родительском компоненте
}
}
