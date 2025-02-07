import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FieldComponent } from '../../common-ui/field/field.component';
import { ButIndexComponent } from '../../common-ui/but-index/but-index.component';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { UsersService } from '../../shared/services/users.service';
import { User } from '../../shared/models/user.model';
import { Message } from '../../shared/models/message.model';
import { AuthService } from '../../shared/services/auth.service';
import { ModalService } from '../modal.service';
import { compareSync } from 'bcryptjs';

@Component({
  selector: 'app-autorization',
  standalone: true,
  imports: [
    CommonModule, 
    FieldComponent, 
    ButIndexComponent,
    ReactiveFormsModule
  ],
  templateUrl: './autorization.component.html',
  styleUrl: './autorization.component.scss'
})
export class AutorizationComponent {
  Textholder: string [] = ["Почта", "Пароль"];
  Id: string[] = ["UserEmail", "UserPasword"]; 
  text: string [] = ["Создать", "Войти"];
  type: string [] = ["email", "password"]
  isOpen: boolean = false;
  numBut: number [] = [1, 2];

  @Output() switchToRegister = new EventEmitter<void>();
  switchToRegistration() {
    this.close(); 
    this.switchToRegister.emit(); 
  }

  onButtonClick() {
    const FormData = this.formAutorization.value

    this.usersService.getUserByEmail(FormData.useremail)
      .subscribe((user: User| null) => {
        if (user) {
          if(compareSync(FormData.userpassword, user.password)) {
            this.message.text = ''
            window.localStorage.setItem('user', JSON.stringify(user));
 
            if (user.role == 'admin') {
              this.authService.login(true);
            }
            else {
              this.authService.login(false);
            }

            this.modalService.checkAndRedirect();

            console.log(user); 
            this.close();
          }
          else {
            const userPasswordControl = this.formAutorization.get('userpassword');
            if (userPasswordControl) {
              userPasswordControl.reset(); 
            }
            this.showMessage("Пользователя с такими данными не существует.")       
          }
        }
        else {
          const userPasswordControl = this.formAutorization.get('userpassword');
            if (userPasswordControl) {
              userPasswordControl.reset(); 
            }
          this.showMessage('Пользователя с такими данными не существует.')
        }
      }
    )
    
  }

  showValidationErrors() {
    const errors: string[] = [];

    if (this.formAutorization.get('email')?.hasError('required')) {
      errors.push('Поле "Почта" обязательно для заполнения.');
    }
    if (this.formAutorization.get('password')?.hasError('required')) {
      errors.push('Поле "Пароль" обязательно для заполнения.');
    }

    if (errors.length > 0) {
      alert(errors.join('\n')); 
    }
  }
  
  open() {
    this.isOpen = true;
  }

  close() {
    this.formAutorization.reset();
    this.isOpen = false;
  }

  formAutorization: FormGroup<{userpassword: FormControl, useremail: FormControl}> = new FormGroup ({
    useremail: new FormControl(null, [Validators.required, Validators.email]),
    userpassword: new FormControl(null, [Validators.required, Validators.minLength(6)]),
  })

  message!: Message;

  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private modalService: ModalService,
  ) {}


  ngOnInit() {
    this.message = new Message('danger', '')
    this.formAutorization.get('useremail')?.valueChanges.subscribe(() => {
      this.message.text = '';
    });

    this.formAutorization.get('userpassword')?.valueChanges.subscribe(() => {
      this.message.text = '';
  });
  }


  private showMessage(text: string, type: string = 'danger') {
    console.log('сообщение об ошибке пароля');
    this.message = new Message(type, text);
}
}

