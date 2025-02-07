import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Order } from '../models/order.model';
import { Observable, throwError, Subject, of } from "rxjs";
import { map, catchError  } from 'rxjs/operators';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private apiUrl = 'http://localhost:3000/orders';
  public ordersSubject = new Subject<Order[]>();
  private orders: Order[] = [];

  constructor(private http: HttpClient) { }

  // Метод для получения всех заказов
  getAllOrders(): Observable<Order[]> { 
    return this.http.get<Order[]>(this.apiUrl); 
  }

  // Метод для создания нового заказа
  createNewOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, order).pipe(
      tap(newOrder => {
        this.orders.push(newOrder);
        this.ordersSubject.next(this.orders);
      })
    );
  }

  // метод обновления заказов
  getOrdersUpdates(): Observable<Order[]> {
    return this.ordersSubject.asObservable();
  }

  // Обработчик ошибок
  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError('Something went wrong; please try again later.');
  }

  // Метод для изменения статуса заказа
  cancelOrder(setstatus: string, orderId?: string): Observable<Order> {
    if (!orderId) {
      throw new Error('Order ID is required to cancel the order');
    }
    return this.http.patch<Order>(`${this.apiUrl}/${orderId}`, { status: setstatus }).pipe(
      tap((updatedOrder) => {
        const index = this.orders.findIndex(order => order.id === updatedOrder.id);
        if (index > -1) {
          this.orders[index] = updatedOrder;
          this.ordersSubject.next(this.orders);
        }
      }),
      catchError(this.handleError)
    );
  }
}
