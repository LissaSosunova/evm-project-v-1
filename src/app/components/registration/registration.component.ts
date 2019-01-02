import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { types } from 'src/app/types/types';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})

export class RegistrationComponent implements OnInit {
  public params: types.Registration;

  constructor(private route: ActivatedRoute, private router: Router, private data: DataService) { }

    ngOnInit() {

    }

  public setRegConf (username: string, email: string, password: string) {
    this.params = {
      username,
      email,
      password
    };
    this.data.setReg(this.params).subscribe(
      data => {
        console.log(data);
        this.router.navigate(['../login']);
      }
    );
  }

}
