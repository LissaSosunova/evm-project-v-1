import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ToastService } from 'src/app/shared/toasts/services/toast.service';
import { AvatarService } from 'src/app/services/avatar.service';
import { DataService } from 'src/app/services/data.service';
import { ActivatedRoute, Router, RouterOutlet, NavigationStart } from '@angular/router';
import { types } from 'src/app/types/types';
import { Store, select } from '@ngrx/store';
import * as userAction from '../../store/actions';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public editedName: boolean = false;
  public editedMail: boolean = false;
  public editedPhone: boolean = false;
  public user: types.User = {} as types.User;
  public avatar: string;
  @ViewChild('uploadFile', {static: true}) public uploadFile: ElementRef;

  constructor(
    private router: Router,
    private data: DataService,
    private toastService: ToastService,
    private avatarService: AvatarService,
    private store: Store<any>
  ) { }

  ngOnInit() {
    this.init();
  }

  init() {
    const user$ = this.store.select('user');
    user$.subscribe((state) => {
      if (typeof state !== undefined) {
        this.user = state;
      }
    });
    this.user.avatar = this.avatarService.parseAvatar(this.user.avatar);
    this.user.contacts.forEach(contact => {
      contact.avatar = this.avatarService.parseAvatar(contact.avatar);
    });
  }
  public saveNewName(e): void {
    this.editedName = true;
  }
  public saveNewPhone(e): void {
    this.editedPhone = true;
  }
  public saveName(val: string): void {
    this.data.setNewProfileData({name: val}).subscribe((resp) => {
      this.toastService.openToastSuccess('Your name was chanched successful');
      this.editedName = false;
    });
  }
  public savePhone(val: string): void {   
    this.data.setNewProfileData({phone: val}).subscribe((resp) => {
      this.toastService.openToastSuccess('Your phone number was chanched successful');
      this.editedPhone = false;
    });
  }
  public saveNewMail(e): void {
    this.editedMail = true;
  }
  public saveMail(val: string): void {
    const params = {username: this.user.username, newEmail: val};
    this.data.changeEmail(params).subscribe((res) => {
      this.toastService.openToastSuccess('Your e-mail was chanched. Check your e-mail and confirm');
      this.editedMail = false;
    });
  }
  public deleteAvatar(): void {
    this.data.deleteAvatar({userId: this.user.username}).subscribe(response => {
      this.store.dispatch(new userAction.UpdateAvatarURL(response));
    });
  }
  public uploadAvatar(event): void {
    const files = this.uploadFile.nativeElement.files;
    const formData: FormData = new FormData();
    formData.append('image', files[0]);
    formData.append('userId', this.user.username);
    this.data.uploadAvatar(formData, this.user.username).subscribe((res) => {
      const avatar: types.Avatar = this.avatarService.parseAvatar(res);
      this.store.dispatch(new userAction.UpdateAvatarURL(avatar));
    }, err => {
      this.toastService.openToastFail('Error in uploading avatar');
    });
  }
}
