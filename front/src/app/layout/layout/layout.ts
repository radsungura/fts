import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Subscription, filter } from 'rxjs';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatBadgeModule,
    MatDividerModule,
  ],
  templateUrl: './layout.html',
  styleUrls: ['./layout.scss'],
})
export class Layout implements OnInit, OnDestroy {
  isDarkMode = false;
  isMobile = false;
  drawerOpened = true;

  private subscriptions = new Subscription();

  user = {
    name: 'Rad Dev',
    role: 'Administrateur',
  };

  notifications = [
    {
      id: 1,
      message: 'Nouveau document ajouté',
      read: false,
    },
    {
      id: 2,
      message: 'Utilisateur invité au projet',
      read: false,
    },
    {
      id: 3,
      message: 'Sauvegarde automatique terminée',
      read: true,
    },
  ];

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Détection des écrans mobiles et des tablettes.
    const screenSubscription = this.breakpointObserver
      .observe('(max-width: 768px)')
      .subscribe(({ matches }) => {
        this.isMobile = matches;

        // Menu fermé sur mobile, permanent sur ordinateur.
        this.drawerOpened = !this.isMobile;
      });

    this.subscriptions.add(screenSubscription);

    // Fermer automatiquement le menu après la navigation mobile.
    const navigationSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this.isMobile) {
          this.drawerOpened = false;
        }
      });

    this.subscriptions.add(navigationSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  get unreadCount(): number {
    return this.notifications.filter((notification) => !notification.read).length;
  }

  toggleDrawer(): void {
    this.drawerOpened = !this.drawerOpened;
  }

  closeDrawerOnMobile(): void {
    if (this.isMobile) {
      this.drawerOpened = false;
    }
  }

  markAllAsRead(): void {
    this.notifications.forEach((notification) => (notification.read = true));
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
  }
}
