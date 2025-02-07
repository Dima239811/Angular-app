import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { HeaderComponent } from './common-ui/header/header.component';
import { FooterComponent } from './common-ui/footer/footer.component';
import { UsersService } from './shared/services/users.service';
import { AuthService } from './shared/services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { OrdersService } from './shared/services/orders.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, HeaderComponent, FooterComponent, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [
    UsersService,
    OrdersService,
  ],
})
export class AppComponent {
  /* title = 'laba'; */
}
