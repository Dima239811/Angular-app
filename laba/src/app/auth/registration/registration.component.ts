import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FieldComponent } from '../../common-ui/field/field.component';
import { ButIndexComponent } from '../../common-ui/but-index/but-index.component';
import { ModalService } from '../modal.service';
import { FormControl, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { UsersService } from '../../shared/services/users.service';
import { User } from '../../shared/models/user.model';
import { Message } from '../../shared/models/message.model';
import { AuthService } from '../../shared/services/auth.service';
import { HttpClient } from "@angular/common/http";
import { Router, UrlTree } from "@angular/router";
import { Observable, map, catchError, of, tap  } from "rxjs";
import { hashSync }  from 'bcryptjs';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    CommonModule, 
    FieldComponent, 
    ButIndexComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent {
  Textholder: string [] = ["Имя", "Почта", "Пароль", "Подтвердите пароль"];
  Id: string[] = ["username", "email", "password", "confirmpassword"]; 
  text: string [] = ["Регистрация", "Войти"];
  type: string [] = ["text", "email", "password"];
  buttons: number [] = [1, 2];
  isOpen: boolean = false;
  message!: Message;

  @Output() switchToAuth = new EventEmitter<void>();
  switchToAuthorization() {
    this.close(); 
    this.switchToAuth.emit(); 
  }

  private passwordMatchValidator: ValidatorFn = (form: AbstractControl): { [key: string]: boolean } | null => {
    const password = form.get('userpassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    console.log(password === confirmPassword + ' validator ')
    return password === confirmPassword ? null : { mismatch: true };
  };

  forbiddenEmails: AsyncValidatorFn = (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
        return of(null); 
    }

    return this.usersService.getUserByEmail(control.value).pipe(
        map((user: User | null) => { 
            console.log("user  ", user);
            if (user) {
                console.log("есть пользователь");
                return { forbiddenEmail: true }; 
            }
            console.log("пользователя нет"); 
            return null; 
        }),
        catchError(() => {
            console.error("Ошибка при проверке email."); 
            return of(null); 
        })
    );
};

  form: FormGroup<{
                  username: FormControl, 
                  userpassword: FormControl, 
                  useremail: FormControl, 
                  confirmPassword: FormControl,
                }> = new FormGroup ({
    username: new FormControl(null, Validators.required),
    useremail: new FormControl(null, [Validators.required, Validators.email], this.forbiddenEmails.bind(this)),
    userpassword: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl(null, [Validators.required, Validators.minLength(6)]),
  }, { validators: this.passwordMatchValidator }); 

  
  onButtonClick() {
      if (this.form.valid) {
        const {username, useremail, userpassword} = this.form.value;

        // Хэшируем пароль
        const hashedPassword = hashSync(userpassword, 10); // 10 - это количество циклов хэширования
        const user = new User(username, useremail, hashedPassword);
        
        this.usersService.createNewUser(user)
        .subscribe((user: User) => {
          if(user) {
            window.localStorage.setItem('user', JSON.stringify(user));
            this.authService.login(false);
            

            this.modalService.checkAndRedirect();

            console.log(user); 
            this.close();
          }
        });
      }  
      else {
        console.log(this.form.errors);
        console.log(this.form.controls);  
        console.log("форма невалидна")
        this.showMessage('Такого пользователя не существует')
      }

  }

  open() {
    this.isOpen = true;
  }

  close() {
    this.form.reset();
    this.isOpen = false;
  }

  
  showValidationErrors() {
    const errors: string[] = [];

    if (this.form.get('username')?.hasError('required')) {
      errors.push('Поле "Имя" обязательно для заполнения.');
    }

    const emailControl = this.form.get('email');
    if (emailControl?.hasError('required')) {
        errors.push('Поле "Почта" обязательно для заполнения.');
    } else if (emailControl?.hasError('email')) {
        errors.push('Введите действительный адрес электронной почты.');
    }

    if (this.form.get('password')?.hasError('required')) {
      errors.push('Поле "Пароль" обязательно для заполнения.');
    }

    if (errors.length > 0) {
      alert(errors.join('\n')); 
    }
  }

  private showMessage(text: string, type: string = 'danger') {
    this.message = new Message(type, text);
    window.setTimeout(() => {
        this.message.text = '';
    }, 5000);
}
  
  constructor(
    private http: HttpClient,
    private usersService: UsersService,
    private authService: AuthService,
    private modalService: ModalService,
  ) {}

}
