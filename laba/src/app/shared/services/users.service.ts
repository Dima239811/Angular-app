import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { User } from "../models/user.model";
import { Observable, throwError } from "rxjs";
import { map, catchError  } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = 'http://localhost:3000/users';
  constructor(private http: HttpClient) { }

  getUserByEmail(email: string): Observable<User | null> {
    return this.http.get<User[]>(`${this.apiUrl}?email=${email}`).pipe(
      map((users: User[]) => users.length > 0 ? users[0] : null)
    );
  }

  createNewUser (user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user).pipe( 
      map((response: User) => response)
    );
  }

  updateUser (userData: Partial<User>): Observable<User> {
    // Проверяем, существует ли ID
    if (!userData.id) {
      return throwError('ID пользователя не указан');
    }
  const { ...userDataWithoutRole } = userData;

  return this.http.put<User>(`${this.apiUrl}/${userData.id}`, userDataWithoutRole).pipe(
    catchError(err => {
      console.error('Ошибка при обновлении пользователя:', err);
      return throwError(err);
    })
  );
  }

}
