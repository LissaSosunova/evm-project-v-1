import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Subscription, observable } from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { types } from 'src/app/types/types';
import { TransferService } from 'src/app/services/transfer.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})

export class ContactsComponent implements OnInit, AfterViewInit, OnDestroy {

  public user: types.User = {} as types.User;
  public test: String = 'This is test data';
  public contactsConfirmed: Array<types.Contact> = [];
  public contactsAwaiting: Array<types.Contact> = [];
  public contactsRequested: Array<types.Contact> = [];
  public query: types.FindUser;
  public querySearch: any;
  public result: any;
  public currTab: string;
  private searchSubscription: Subscription;
  public searchControl: FormControl;

  constructor(private transferService: TransferService,
              private route: ActivatedRoute,
              private router: Router,
              private data: DataService) {

            }

  ngOnInit() {
    this.init();
    this.initSearchForm();
  }

  ngAfterViewInit() {

  }

  ngOnDestroy() {
    this.searchSubscription.unsubscribe();
  }


  public addNewUser(query: string): void {
    this.query = {
      query: query
    };
    const sub = this.data.addUser(this.query).subscribe(
      data => {
        // this.querySearch = data;
        sub.unsubscribe();
      }
    );
  }

  public confNewUser(query: string): void {
    this.query = {
      query: query
    };
    const sub = this.data.confUser(this.query).subscribe(
      data => {
        sub.unsubscribe();
      }
    );
  }

  public setSearch(query: string): void {
    this.query = {
      query: query
    };
    const sub = this.data.findUser(this.query).subscribe(
      data => {
        this.querySearch = data;
        sub.unsubscribe();
      }
    );
  }

  public switcher(currId: string): void {
    this.router.navigate([], {
      queryParams: {
        currTab: currId
      }
    });
    this.currTab = currId;
  }

  private init(): void {
    const user = this.transferService.dataGet('userData');
    this.user = Object.assign({}, user);
    this.transferService.setDataObs(this.test);
    this.currTab = this.route.snapshot.queryParams.currTab;
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

  private initSearchForm(): void {
    this.searchControl = new FormControl();
    this.searchSubscription = this.searchControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(query => {
        if (query) {
          this.setSearch(query);
        }
      });
  }

}
