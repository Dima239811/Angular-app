import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FieldComponent } from '../../common-ui/field/field.component';
import { ButIndexComponent } from '../../common-ui/but-index/but-index.component';
import { FormControl, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn, AsyncValidatorFn } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Order } from '../../shared/models/order.model';
import { OrdersService } from '../../shared/services/orders.service';
import { AuthService } from '../../shared/services/auth.service';
import { User } from '../../shared/models/user.model';
import { Observable, of, forkJoin } from "rxjs";
import { map, catchError  } from 'rxjs/operators';
import { Message } from '../../shared/models/message.model';
@Component({
  selector: 'app-record',
  standalone: true,
  imports: [
    CommonModule, 
    FieldComponent, 
    ButIndexComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './record.component.html',
  styleUrl: './record.component.scss'
})
export class RecordComponent {
  textholder: string [] = ["Имя", "Модель машины", "Дата записи", "Время записи:", "Почта"];
  Id: string[] = ["name", "UserCar", "UserRecordDate", "userRecordTime", "email"]; 
  text: string [] = ["Записаться"];
  type: string [] = ["text", "email", "date", "time"];
  isOpen: boolean = false;
  buttons: number = 1;
  isAuthenticated: boolean = false;
  isAdmin: boolean = false;
  user!:User;

  open() {
    this.isOpen = true;
  }

  constructor (private orderService: OrdersService, private authService: AuthService) {}

  dateNotInPastValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const inputDate = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Устанавливаем время на полночь для сравнения
  
      return inputDate < today ? { dateInPast: true } : null;
    };
  }

  timeRangeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const inputTime = control.value;

        if (!inputTime) {
            return null;
        }

        const [hours, minutes] = inputTime.split(':').map(Number);
        const timeInMinutes = hours * 60 + minutes;

        // Определяем границы в минутах
        const startTime = 9 * 60; // 9:00 в минутах
        const endTime = 18 * 60; // 18:00 в минутах

        if (timeInMinutes < startTime || timeInMinutes > endTime) {
            return { timeOutOfRange: true }; // Возвращаем ошибку, если время вне диапазона
        }

        return null; // Если все проверки пройдены, возвращаем null
    };
}

// Валидатор для проверки, что время установлено на целые часы
wholeHourValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
      const inputTime = control.value;

      if (!inputTime) {
          return null; 
      }

      const [hours, minutes] = inputTime.split(':').map(Number);

      if (minutes !== 0) {
          return { notWholeHour: true }; 
      }

      return null;
  };
}


  formRecord: FormGroup<{
    username: FormControl;
    useremail: FormControl;
    modelCar: FormControl;
    date: FormControl;
    time: FormControl;
  }> = new FormGroup({
    username: new FormControl(null, [Validators.required]), 
    useremail: new FormControl(null, [Validators.required, Validators.email]),
    modelCar: new FormControl(null, [Validators.required]),
    date: new FormControl(null, [Validators.required, this.dateNotInPastValidator()]),
    time: new FormControl(null, [Validators.required, this.timeRangeValidator(), this.wholeHourValidator()],),
  });

  ngOnInit() {
    this.checkAuthentication();
  }

  checkAuthentication() {
    // Проверка статуса авторизации
    this.authService.getAuthStatus().subscribe(authStatus => {
      this.isAuthenticated = authStatus;
      this.updateFormControls();
    });

    this.authService.getAdminStatus().subscribe(adminStatus => {
      this.isAdmin = adminStatus;
      this.updateFormControls();
    });
  }

  updateFormControls() {
    const userData = localStorage.getItem('user');

    if (userData) {
      const parsedUser = JSON.parse(userData);

      this.user = new User(parsedUser.name, parsedUser.email, parsedUser.password, parsedUser.role || undefined, parsedUser.id);

      if (this.isAuthenticated && !this.isAdmin) {

        this.formRecord.get('username')?.setValue(parsedUser.name);
        this.formRecord.get('useremail')?.setValue(parsedUser.email);
    } else {
      // Если пользователь администратор, сбрасываем значения
      this.formRecord.get('username')?.setValue(null);
      this.formRecord.get('useremail')?.setValue(null);
    }
  }
    else {
      // Если пользователь не авторизован, включаем поля
      this.formRecord.get('username')?.setValue(null);
      this.formRecord.get('useremail')?.setValue(null);
  }
}

  onButtonClick() {
    if (this.formRecord.valid) {
      const orderData: Order = {
        name: this.formRecord.value.username,
        email: this.formRecord.value.useremail,
        model: this.formRecord.value.modelCar,
        date: this.formRecord.value.date,
        time: this.formRecord.value.time,
        status: "подтвержден",
    };

    this.orderService.createNewOrder(orderData).subscribe(response => {
      this.orderService.getAllOrders().subscribe((orders: Order[]) => {
        this.orderService.ordersSubject.next(orders); // Уведомление о новых заказах
      });

    }, error => {
        console.error('Error saving order', error);
    });
    this.close();
    }
    else {
      console.log("форма невалидна")
    }
    
  }

  close() {
    this.formRecord.reset();
    this.isOpen = false;
  }

  message!: Message;
  private showMessage(text: string, type: string = 'danger') {
    this.message = new Message(type, text);
    window.setTimeout(() => {
        this.message.text = '';
    }, 5000);
}

}
