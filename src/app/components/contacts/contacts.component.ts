import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { types } from 'src/app/types/types';
import { TransferService } from 'src/app/services/transfer.service';
import { DataService } from 'src/app/services/data.service';

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
  public query: types.FindUser;
  public querySearch: any;
  public result: any;
  private subscription: Subscription;

  constructor(private transferService: TransferService,
              private route: ActivatedRoute,
              private router: Router,
              private data: DataService) {

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
    const currActiveElement = document.getElementsByClassName('is-vis-tab');
    for (let i=0; i<currActiveElement.length; i++){
      currActiveElement[i].classList.toggle('is-vis-tab');
    }
    document.getElementById(currId).classList.toggle('is-vis-tab');
    console.log(currId);
  }
  public setSearch(query: string) {
    this.query = {
      query: query
    };
    console.log(typeof query);
    this.data.findUser(this.query).subscribe(
      data => {
        this.querySearch = data;
        console.log(this.querySearch);

      }
    );
  }
  public addNewUser(query: string) {
    this.query = {
      query: query
    };
    console.log(typeof query);
    this.data.addUser(this.query).subscribe(
      data => {
        this.querySearch = data;
        console.log(this.querySearch);

      }
    );
  }
  public confNewUser(query: string) {
    this.query = {
      query: query
    };
    this.data.confUser(this.query).subscribe(
      data => {
        console.log(data);
      }
    );
  }
}
