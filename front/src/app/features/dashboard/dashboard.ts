import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';

// 👉 très important : enregistrer tous les contrôleurs/elements/plugins
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatListModule, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class Dashboard {
  stats = {
    total: 120,
    actifs: 80,
    archives: 30,
    users: 10,
  };

  lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [
      'Jan',
      'Fév',
      'Mar',
      'Avr',
      'Mai',
      'Juin',
      'Juillet',
      'Aout',
      'Sept',
      'Oct',
      'Nov',
      'Dec',
    ],
    datasets: [
      {
        data: [5, 8, 12, 20, 15, 25, 18, 22, 30, 27, 35, 40],
        label: 'Documents ajoutés',
      },
      {
        data: [12, 3, 5, 1, 0, 8, 6, 10, 7, 12, 9, 15],
        label: 'Documents archivés',
      },
    ],
  };
  lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
  };
  pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: ['Contrats', 'Factures', 'Rapports', 'Autres'],
    datasets: [{ data: [30, 40, 25, 25] }],
  };
  pieChartType: ChartType = 'pie';

  recentActivity = [
    { icon: 'add', text: 'Contrat X ajouté par Alice' },
    { icon: 'archive', text: 'Facture Y archivée par Bob' },
    { icon: 'person_add', text: 'Utilisateur Charlie créé' },
  ];
}
