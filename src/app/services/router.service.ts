import { Injectable } from '@angular/core';
import { Router, RouterEvent, NavigationEnd, NavigationStart } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RouterService {

  private prevRoute$: BehaviorSubject<string>;
  private routeSubj$: BehaviorSubject<string>;

  constructor(private router: Router) {
    const currRoute = this.router.url.split('?')[0];
    this.prevRoute$ = new BehaviorSubject<string>('');
    this.routeSubj$ = new BehaviorSubject<string>(currRoute);

    this.router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationStart) {
        const oldUrl = (event.url).split('?')[0];
        const newUrl = this.router.url.split('?')[0];
        if (oldUrl !== newUrl) {
          this.routeSubj$.next(event.url);
          this.prevRoute$.next(this.router.url);
        }
      }
    });
   }

   public getCurrentRoute$(): Observable<string> {
     return new Observable (observer => {
       const sub = this.routeSubj$
       .subscribe(url => {
        observer.next(url);
       });
       return () => sub.unsubscribe();
     });
   }

   public getPreviousRoute$(): Observable<string> {
    return new Observable (observer => {
      const sub = this.prevRoute$
       .subscribe(url => {
         observer.next(url);
        });

        return () => sub.unsubscribe();
      });
  }
}
