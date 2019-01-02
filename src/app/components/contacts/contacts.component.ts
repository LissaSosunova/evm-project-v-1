import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { types } from 'src/app/types/types';
import { TransferService } from 'src/app/services/transfer.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})

export class ContactsComponent implements OnInit {

  public user: types.User = {} as types.User;
  public test: String = 'This is test data';

  private subscription: Subscription;

  constructor(private transferService: TransferService,
              private route: ActivatedRoute,
              private router: Router) {

            }

  ngOnInit() {
    this.init();
  }

  public init(): void {
    const user = this.transferService.dataGet('userData');
    this.user = Object.assign(user);
    console.log(this.user); // Получили данные пользователя
    this.transferService.setDataObs(this.test);
  }

}
