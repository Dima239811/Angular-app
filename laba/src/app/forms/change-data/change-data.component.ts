import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FieldComponent } from '../../common-ui/field/field.component';
import { ButIndexComponent } from '../../common-ui/but-index/but-index.component';
import { FormControl, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { User } from '../../shared/models/user.model';
import { Message} from '../../shared/models/message.model';
import { AuthService } from '../../shared/services/auth.service';
import { UsersService } from '../../shared/services/users.service';
import { hashSync }  from 'bcryptjs';

import { Observable, map, catchError, of, tap  } from "rxjs";
@Component({
  selector: 'app-change-data',
  standalone: true,
  imports: [
    CommonModule, 
    FieldComponent, 
    ButIndexComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './change-data.component.html',
  styleUrl: './change-data.component.scss'
})
export class ChangeDataComponent {
  text: string [] = ["Сохранить изменения"];
  isOpen: boolean = false;
  buttons: number = 1;
  private userId!: number;
  private role!: string | null;

  @Output() dataChanged = new EventEmitter<User>();

  private passwordMatchValidator: ValidatorFn = (form: AbstractControl): { [key: string]: boolean } | null => {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmpassword')?.value;
    console.log(password === confirmPassword + ' validator ')
    return password === confirmPassword ? null : { mismatch: true };
  };

  forbiddenEmails: AsyncValidatorFn = (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value || control.value === this.oldEmail) {
        return of(null); // Если email пустой или совпадает со старым, пропускаем валидацию
    }

    return this.userService.getUserByEmail(control.value).pipe(
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

  changeDataForm: FormGroup<{
    name: FormControl, 
    email: FormControl, 
    password: FormControl,
    confirmpassword: FormControl 
  }> = new FormGroup ({
        name: new FormControl(null, Validators.required),
        email: new FormControl(null, [Validators.required, Validators.email], this.forbiddenEmails.bind(this)),
        password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
        confirmpassword: new FormControl(null, [Validators.required, Validators.minLength(6)]),
}, { validators: this.passwordMatchValidator }); 

  open(user: User, role: string) {
    this.isOpen = true;
    this.userId = user.id!;
    this.oldEmail = user.email;
    this.role = role;
    console.log('Статус пользователя пришедшего на форму', this.role);
    
    this.changeDataForm.patchValue({
      name: user.name,
      email: user.email,
      password: '',
      confirmpassword: ''
    });

    // Сбрасываем состояние формы
    this.changeDataForm.markAsPristine();
    this.changeDataForm.markAsUntouched();
  }

  close() {
    this.isOpen = false;
  }

  constructor(private userService: UsersService, private authService: AuthService) {}


  onButtonClick() {
    if (this.changeDataForm.valid) {

      const { password, confirmpassword, ...userData } = this.changeDataForm.value;
        const updatedUserData: Partial<User> = {
            ...userData,
            id: this.userId,
            role: this.role || undefined
        };
  
        const hashedPassword = hashSync(password, 10);
        updatedUserData.password = hashedPassword; // Добавляем новый пароль

      console.log("Обновленные данные пользователя в форме", updatedUserData);
  
      this.userService.updateUser(updatedUserData).subscribe(response => {
        console.log('Данные успешно обновлены', response);
  
        
        const userToSave: User = {
          ...response, 
          role: this.role || undefined 
        };
  
        localStorage.setItem('user', JSON.stringify(userToSave));
  
        
        this.dataChanged.emit(userToSave);
        this.close(); 
      }, error => {
        console.error('Ошибка при обновлении данных:', error);
      });
    } else {
       this.showMessage('Форма не валидна');
    }
  }

  private oldEmail!: string;
  message!: Message;

  ngOnInit() {
    this.message = new Message('danger', '')
  }


  private showMessage(text: string, type: string = 'danger') {
    this.message = new Message(type, text);
    window.setTimeout(() => {
        this.message.text = '';
    }, 5000);
}
}
