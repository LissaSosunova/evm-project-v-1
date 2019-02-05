import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TokenService } from 'src/app/services/token.service';
import { RouterService } from 'src/app/services/router.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public currParentUrl: string;
  public currChildUrl: string;

  constructor(public router: Router,
            private activateRouter: ActivatedRoute,
            private tokenService: TokenService,
            private routerService: RouterService) { }

  ngOnInit() {
    this.routerService.getCurrentRoute$().subscribe(url => {
      const urlSegments = url.split('/');
      this.currParentUrl = urlSegments[1];
      if (this.currParentUrl === '/' || !this.currParentUrl) {
        this.currParentUrl = 'login';
        const token = this.tokenService.getToken();
        if (token) {
          this.currParentUrl = 'main';
        }
      }
      if (urlSegments.length > 2) {
        this.currChildUrl = urlSegments[2];
        const childSegments = this.currChildUrl.split('?');
        this.currChildUrl = childSegments[0];
      } else {
        this.currChildUrl = '';
      }
    });
  }
  public exit(): void {
    sessionStorage.clear();
  }

}
