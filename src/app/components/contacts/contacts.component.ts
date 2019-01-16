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
  public contactsConfirmed: Array<types.Contact> = [];
  public contactsAwaiting: Array<types.Contact> = [];
  public contactsRequested: Array<types.Contact> = [];
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
    this.transferService.setDataObs(this.test);
    for(let o of this.user.contacts){
      if (o.status == 1){
        this.contactsConfirmed.push(o);
      } else if (o.status == 2){
        this.contactsAwaiting.push(o);
      } else if (o.status == 3){
        this.contactsRequested.push(o);
      }
    }
  }
  public switcher(currId: string) {
    const el = <HTMLInputElement>document.getElementById("currId");
  console.log(currId, el);
}
}
