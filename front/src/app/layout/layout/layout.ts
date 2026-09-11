import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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
export class Layout {

  isDarkMode = false;

  drawerOpened = true;

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

  get unreadCount(): number {
    return this.notifications.filter((notification) => !notification.read).length;
  }

  markAllAsRead(): void {
    this.notifications.forEach((notification) => (notification.read = true));
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
  }
}
