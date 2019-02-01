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
  public currTab: string;
  public search: string;
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
    this.currTab = this.route.snapshot.queryParams.currTab;
    console.log(this.currTab);
    for (const o of this.user.contacts) {
      if (o.status === 1) {
        this.contactsConfirmed.push(o);
      } else if (o.status === 2) {
        this.contactsAwaiting.push(o);
      } else if (o.status === 3) {
        this.contactsRequested.push(o);
      }
    }
  }

  public switcher(currId: string): void {
    this.router.navigate([], {
      queryParams: {
        currTab: currId
      }
    });
    this.currTab = currId;
  }

  public setSearch(query: string): void {
    this.query = {
      query: query
    };
    this.data.findUser(this.query).subscribe(
      data => {
        this.querySearch = data;
        console.log(this.querySearch);

      }
    );
  }

  public addNewUser(query: string): void {
    this.query = {
      query: query
    };
    this.data.addUser(this.query).subscribe(
      data => {
        // this.querySearch = data;
        console.log(data);

      }
    );
  }

  public confNewUser(query: string): void {
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
