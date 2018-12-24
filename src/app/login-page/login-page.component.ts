import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs';
import { types} from '../types/types';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  public params: types.login;
  public token: string;
  public dataResp: types.loginResp;

  constructor(private route: ActivatedRoute, private router: Router, private data: DataService) { }


  ngOnInit() {
  }

  public setAuthConf(username, password) {
      this.params = {
        username,
        password
      };
    this.data.setAuth(this.params).subscribe(
      data => {
        console.log(data);
        this.dataResp = data as types.loginResp;
        if (this.dataResp.success === true) {
          this.token = this.dataResp.access_token;
          sessionStorage.setItem('_token', this.token);
          this.router.navigate(['../main']);
        }
      }
    );
  }

}
