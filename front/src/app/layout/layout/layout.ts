// import { Component, Input, Output, EventEmitter } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterModule } from '@angular/router';
// import { MatSidenavModule } from '@angular/material/sidenav';
// import { MatToolbarModule } from '@angular/material/toolbar';
// import { MatButtonModule } from '@angular/material/button';
// import { MatIconModule } from '@angular/material/icon';
// import { MatListModule } from '@angular/material/list';

// @Component({
//   selector: 'app-layout',
//   standalone: true,
//   imports: [
//     CommonModule,
//     RouterModule,
//     MatSidenavModule,
//     MatToolbarModule,
//     MatButtonModule,
//     MatIconModule,
//     MatListModule
//   ],
//   templateUrl: './layout.html',
//   styleUrls: ['./layout.scss']
// })
// export class Layout {
//   @Input() isLight = true;
//   @Output() toggleTheme = new EventEmitter<void>();

//   drawerOpened = true; // état de la sidebar
// }


// 

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
    MatBadgeModule
  ],
  templateUrl: './layout.html',
  styleUrls: ['./layout.scss']
})
export class Layout {
  @Input() isLight = true;
  @Output() toggleTheme = new EventEmitter<void>();

  drawerOpened = true;

  user = {
    name: 'Rad Dev',
    role: 'Admin',
    avatar: '../../assets/avatar.png'
  };

  // 🔔 Fake notifs (on pourrait les charger d’une API)
  notifications = [
    { id: 1, message: 'Nouveau document ajouté', read: false },
    { id: 2, message: 'Utilisateur invité au projet', read: false },
    { id: 3, message: 'Sauvegarde automatique terminée', read: true }
  ];

  get unreadCount() {
    return this.notifications.filter(n => !n.read).length;
  }

  markAllAsRead() {
    this.notifications.forEach(n => (n.read = true));
  }
}

