import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { TransferService } from 'src/app/services/transfer.service';
import { types } from 'src/app/types/types';
import { UserInfoPopupComponent } from '../user-info-popup/user-info-popup.component';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { PopupDetailsComponent } from './popup-details/popup-details.component';
import { ToastService } from 'src/app/shared/toasts/services/toast.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})

export class ContactsComponent implements OnInit, AfterViewInit, OnDestroy {

  public actionName: string;
  public isOpened: boolean;
  public contactsAwaiting: Array<types.Contact> = [];
  public contactsConfirmed: Array<types.Contact> = [];
  public contactsRequested: Array<types.Contact> = [];
  public currTab: string;
  public isContactsAwaiting: boolean;
  public isContactsConfirmed: boolean;
  public iscontactsRequested: boolean;
  public query: types.FindUser;
  public querySearch: any;
  public result: any;
  public searchControl: FormControl;
  public test: String = 'This is test data';
  public user: types.User = {} as types.User;

  @ViewChild('userPopup') private userPopup: UserInfoPopupComponent;
  @ViewChild('popupDetails') private confirmAction: PopupDetailsComponent;

  private unsubscribe$: Subject<void> = new Subject();

  constructor(private transferService: TransferService,
              private route: ActivatedRoute,
              private router: Router,
              private data: DataService,
              private toastService: ToastService) {

            }

  ngOnInit() {
    this.init();
    this.initSearchForm();
  }

  ngAfterViewInit() {

  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.userPopup.onClose();
    this.confirmAction.onClose();
  }


  public addNewUser(query: string): void {
    this.query = {
      query: query
    };
    this.data.addUser(this.query).subscribe(
      data => {
        for(let i =0; i < this.querySearch.length; i++){
          if(this.querySearch[i].id == this.query.query){
            this.querySearch.splice(i, 1);
          }
        }
        this.user = Object.assign({}, data);
        this.transferService.dataSet({name: 'userData', data: this.user});
        this.initSortContactLists();
      }
    );
  }

  public confNewUser(query: string): void {
    this.query = {
      query: query
    };
    this.data.confUser(this.query).subscribe(
      data => {
        this.user = Object.assign({}, data);
        this.transferService.dataSet({name: 'userData', data: this.user});
        this.initSortContactLists();
        this.toastService.openToastSuccess('Confirmed!');
      }
    );
  }

  private init(): void {
    const user = this.transferService.dataGet('userData');
    this.user = Object.assign({}, user);
    this.transferService.setDataObs(this.test);
    this.currTab = this.route.snapshot.queryParams.currTab;
    this.initSortContactLists();
    if(!this.currTab) {
      this.currTab = 'contacts';
    }
  }
  
  private initSortContactLists(): void {
    this.contactsConfirmed=[];
    this.contactsAwaiting=[];
    this.contactsRequested=[];
    this.isContactsConfirmed = false;
    this.isContactsAwaiting = false;
    this.iscontactsRequested = false;
    for (const o of this.user.contacts) {
      if (o.status === 1) {
        this.isContactsConfirmed = true;
        this.contactsConfirmed.push(o);
      } else if (o.status === 2) {
        this.isContactsAwaiting = true;
        this.contactsAwaiting.push(o);
      } else if (o.status === 3) {
        this.iscontactsRequested = true;
        this.contactsRequested.push(o);
      }
    }
  }

  private initSearchForm(): void {
    this.searchControl = new FormControl();
    this.searchControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this.unsubscribe$))
      .subscribe(query => {
        if (query) {
          this.setSearch(query);
        }
      });
  }

  public onConfirmActionPopupOpen(actionName: string): void {
    this.actionName = actionName;
    // debugger;
    this.confirmAction.open();
  }

  public onUserInfoPopupOpen(): void {
    this.userPopup.open();
  }

  public setSearch(query: string): void {
    this.query = {
      query: query
    };
    this.data.findUser(this.query).subscribe(
      data => {
        this.querySearch = data;
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
}
