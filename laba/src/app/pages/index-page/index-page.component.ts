import { Component, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../common-ui/header/header.component';
import { FooterComponent } from '../../common-ui/footer/footer.component';
import { FieldComponent } from '../../common-ui/field/field.component';
import { RecordComponent } from '../../forms/record/record.component';
import { RouterOutlet, RouterLink, RouterLinkActive} from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { ButIndexComponent } from '../../common-ui/but-index/but-index.component';
import { AuthService } from '../../shared/services/auth.service';
@Component({
  selector: 'app-index-page',
  standalone: true,
  imports: [
            HeaderComponent,
            FooterComponent, 
            FieldComponent, 
            RecordComponent, 
            RouterOutlet, 
            RouterLink, 
            RouterLinkActive,
            CommonModule,
            ButIndexComponent,
          ],
  templateUrl: './index-page.component.html',
  styleUrl: './index-page.component.scss'
})
export class IndexPageComponent {
  @ViewChild ('modalRecord') modal1!: RecordComponent;
  textBut: string = "Запись на услугу";
  num: number = 3;
  isAuth!: boolean;
  
  openModal(modalId: string) { 
    if (modalId === 'modalRecord') {
      this.modal1.open(); 
    } 
  }

  constructor(private authservice: AuthService) {}

}
