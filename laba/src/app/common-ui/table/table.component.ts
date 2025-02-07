import { Component, Input, OnInit, ViewChild  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersService } from '../../shared/services/orders.service'; 
import { Order } from '../../shared/models/order.model';
import { Observable } from 'rxjs';
import { ResetComponent } from '../../forms/reset/reset.component';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, ResetComponent, FormsModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent {
  @Input() admin!: boolean
  @ViewChild ('modalReset') modal2!: ResetComponent;
  userEmail!: string; 
  orders: Order[] = [];
  sortBy: string = 'status'; // по умолчанию сортировка по статусу

  selectedOrder: Order | null = null;
  isOpen: boolean = false;

  constructor(private ordersService: OrdersService) {}

  ngOnInit() {
    const userData = localStorage.getItem('user');

    if (userData) {
      const parsedUser = JSON.parse(userData);
      console.log("извлеченный пользователь из локал сторедж")
      console.log(parsedUser);

      this.userEmail = parsedUser.email;
    }

    this.ordersService.getAllOrders().subscribe((orders: Order[]) => {
      this.orders = orders;
      this.ordersService.ordersSubject.next(orders); // Уведомляем подписчиков
      this.sortData();
    });
  
    this.ordersService.getOrdersUpdates().subscribe((orders: Order[]) => {
      this.orders = this.sortOrders(orders, this.sortBy);
    });
  }

  // Метод для получения заказов в зависимости от роли
  get filteredOrders(): Order[] {
    const ordersToFilter = this.admin ? this.orders : this.orders.filter(order => order.email === this.userEmail);
    return this.sortOrders(ordersToFilter, this.sortBy); // Сортируем отфильтрованные заказы по выбранному критерию
  }

  openModal(order: Order, status: string) {
    this.selectedOrder = order; // Сохраняем выбранный заказ
    this.modal2.open(status);   
  }

  // Подписка на событие нажатия на кнопку изменить статус заказа
  onButtonClickCancelOrder(status: string) {
    this.onCancelOrder(status); // Вызываем метод изменения статуса заказа
  }

  onCancelOrder(statustochange: string) {
    if (this.selectedOrder) {
      this.ordersService.cancelOrder(statustochange, this.selectedOrder.id).subscribe(() => {
        // После успешной отмены заказа, получаем все заказы заново
        this.ordersService.getAllOrders().subscribe(orders => {
          this.orders = orders; 
          this.selectedOrder = null; // Сбрасываем выбранный заказ
          this.modal2.close(); // Закрываем модальное окно
        });
      }, error => {
        console.error('Error canceling order:', error);
      });
    }
  }

  sortData() {
    this.orders = this.sortOrders(this.orders, this.sortBy);
  }

  private sortOrders(orders: Order[], sortBy: string): Order[] {
    return orders.sort((a, b) => {
      if (sortBy === 'status') {
        if (a.status < b.status) return 1;
        if (a.status > b.status) return -1;
        return 0; // Если статусы равны
      } 
      else if (sortBy === 'date') {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);

        // Сравнение по дате 
        const dateComparison = dateA.getTime() - dateB.getTime();

        if (dateComparison === 0) {
          const getTimeInMinutes = (time: string) => {
            const [hours, minutes] = time.split(':').map(Number); 
            return hours * 60 + minutes; 
          };
        
          const timeA = getTimeInMinutes(a.time);
          const timeB = getTimeInMinutes(b.time);
          
          // Сравниваем по времени
          return timeA - timeB; 
      }
  
        return dateComparison; // Возвращаем результат сравнения по дате
      }

      else if (sortBy === 'clientName') {
            const nameA = a.name.toLowerCase(); 
            const nameB = b.name.toLowerCase();
            if (nameA < nameB) {
                return -1; 
            }
            if (nameA > nameB) {
                return 1; 
            }
            return 0;
    }

      return 0; // Если sortBy не совпадает ни с одним из условий
    });
  }
  
}


