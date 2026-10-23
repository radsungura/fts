import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin, of, Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

import { Document } from '../../services/document';
import { Borrows } from '../../services/borrow';
import { Doc, Mov } from '../../../models/interfaces';

Chart.register(...registerables);

interface Activity {
  icon: string;
  text: string;
  date: Date;
}

interface DashboardAlert {
  icon: string;
  text: string;
  type: 'warning' | 'info';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatListModule, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class Dashboard implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  loading = true;
  loadError = '';

  stats = {
    total: 0,
    actifs: 0,
    empruntes: 0,
    archives: 0,
    retards: 0,
    retours: 0,
  };

  documents: Doc[] = [];
  movements: Mov[] = [];

  recentActivity: Activity[] = [];
  alerts: DashboardAlert[] = [];

  readonly lineChartType: 'line' = 'line';
  readonly barChartType: 'bar' = 'bar';
  readonly doughnutChartType: 'doughnut' = 'doughnut';

  lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Documents ajoutés',
        data: [],
        borderColor: '#008a9b',
        backgroundColor: 'rgba(0, 138, 155, 0.12)',
        fill: true,
        tension: 0.35,
      },
      {
        label: 'Emprunts',
        data: [],
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.12)',
        fill: true,
        tension: 0.35,
      },
    ],
  };

  lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { precision: 0 },
      },
    },
  };

  categoryChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: [],
    datasets: [{ data: [] }],
  };

  departmentChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Documents',
        data: [],
        backgroundColor: '#008a9b',
        borderRadius: 6,
      },
    ],
  };

  locationChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Documents',
        data: [],
        backgroundColor: '#188038',
        borderRadius: 6,
      },
    ],
  };

  readonly doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
    },
  };

  readonly barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: { precision: 0 },
      },
    },
  };

  constructor(
    private readonly documentService: Document,
    private readonly borrowService: Borrows,
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDashboard(): void {
    this.loading = true;
    this.loadError = '';

    forkJoin({
      documents: this.documentService.getAll().pipe(
        catchError(() => {
          this.loadError = 'Impossible de charger les documents.';
          return of([] as Doc[]);
        }),
      ),
      movements: this.borrowService.getAll().pipe(
        catchError(() => {
          this.loadError = this.loadError
            ? 'Impossible de charger les documents et les emprunts.'
            : 'Impossible de charger les emprunts.';
          return of([] as Mov[]);
        }),
      ),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ documents, movements }) => {
          this.documents = documents ?? [];
          this.movements = movements ?? [];

          this.calculateStats();
          this.buildCategoryChart();
          this.buildDepartmentChart();
          this.buildLocationChart();
          this.buildEvolutionChart();
          this.buildAlerts();
          this.buildRecentActivity();

          this.loading = false;
        },
        error: () => {
          this.loadError = 'Une erreur inattendue est survenue.';
          this.loading = false;
        },
      });
  }

  private normalize(value: unknown): string {
    return String(value ?? '')
      .trim()
      .toLocaleLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  private isArchived(doc: Doc): boolean {
    const status = this.normalize(doc.status);
    return status.includes('archiv');
  }

  private isBorrowed(doc: Doc): boolean {
    const status = this.normalize(doc.status);
    return status.includes('emprunt');
  }

  private isActive(doc: Doc): boolean {
    const status = this.normalize(doc.status);

    return status.includes('actif') || status.includes('disponible') || status.includes('en rayon');
  }

  private isReturned(movement: Mov): boolean {
    return this.normalize(movement.status) === 'retourne';
  }

  private isLate(movement: Mov): boolean {
    if (this.isReturned(movement)) {
      return false;
    }

    const status = this.normalize(movement.status);

    if (status === 'en retard') {
      return true;
    }

    if (status !== 'emprunte') {
      return false;
    }

    const dueDate = this.toDate(movement.returnDate);

    return !!dueDate && dueDate.getTime() < this.startOfToday().getTime();
  }

  private calculateStats(): void {
    this.stats = {
      total: this.documents.length,
      actifs: this.documents.filter((doc) => this.isActive(doc)).length,
      empruntes: this.documents.filter((doc) => this.isBorrowed(doc)).length,
      archives: this.documents.filter((doc) => this.isArchived(doc)).length,
      retards: this.movements.filter((movement) => this.isLate(movement)).length,
      retours: this.movements.filter((movement) => this.isReturned(movement)).length,
    };
  }

  private buildCategoryChart(): void {
    const counts = this.countBy(this.documents, (doc) => doc.category, 'Non catégorisé');

    this.categoryChartData = {
      labels: Object.keys(counts),
      datasets: [
        {
          data: Object.values(counts),
          backgroundColor: [
            '#008a9b',
            '#188038',
            '#f59e0b',
            '#7c3aed',
            '#e53935',
            '#64748b',
            '#0f766e',
            '#db2777',
          ],
        },
      ],
    };
  }

  private buildDepartmentChart(): void {
    const counts = this.countBy(this.documents, (doc) => doc.dept_id, 'Département non renseigné');

    const entries = this.topEntries(counts, 8);

    this.departmentChartData = {
      labels: entries.map(([name]) => name),
      datasets: [
        {
          label: 'Documents',
          data: entries.map(([, count]) => count),
          backgroundColor: '#008a9b',
          borderRadius: 6,
        },
      ],
    };
  }

  private buildLocationChart(): void {
    const counts = this.countBy(this.documents, (doc) => doc.location, 'Emplacement non renseigné');

    const entries = this.topEntries(counts, 8);

    this.locationChartData = {
      labels: entries.map(([name]) => name),
      datasets: [
        {
          label: 'Documents',
          data: entries.map(([, count]) => count),
          backgroundColor: '#188038',
          borderRadius: 6,
        },
      ],
    };
  }

  private buildEvolutionChart(): void {
    const now = new Date();
    const months: Date[] = [];

    for (let offset = 5; offset >= 0; offset--) {
      months.push(new Date(now.getFullYear(), now.getMonth() - offset, 1));
    }

    const labels = months.map((date) =>
      date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }),
    );

    const documentsByMonth = months.map(
      (month) =>
        this.documents.filter((doc) => {
          const date = this.toDate(doc.created_at);
          return (
            !!date &&
            date.getFullYear() === month.getFullYear() &&
            date.getMonth() === month.getMonth()
          );
        }).length,
    );

    const loansByMonth = months.map(
      (month) =>
        this.movements.filter((movement) => {
          const date = this.toDate(movement.borrowDate);
          return (
            !!date &&
            date.getFullYear() === month.getFullYear() &&
            date.getMonth() === month.getMonth()
          );
        }).length,
    );

    this.lineChartData = {
      labels,
      datasets: [
        {
          label: 'Documents ajoutés',
          data: documentsByMonth,
          borderColor: '#008a9b',
          backgroundColor: 'rgba(0, 138, 155, 0.12)',
          fill: true,
          tension: 0.35,
        },
        {
          label: 'Emprunts',
          data: loansByMonth,
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.12)',
          fill: true,
          tension: 0.35,
        },
      ],
    };
  }

  private buildAlerts(): void {
    const alerts: DashboardAlert[] = [];

    const lateCount = this.stats.retards;

    if (lateCount > 0) {
      alerts.push({
        icon: 'warning',
        text: `${lateCount} emprunt(s) en retard nécessitent un suivi.`,
        type: 'warning',
      });
    }

    const withoutLocation = this.documents.filter(
      (doc) => !String(doc.location ?? '').trim(),
    ).length;

    if (withoutLocation > 0) {
      alerts.push({
        icon: 'place',
        text: `${withoutLocation} document(s) n'ont pas d'emplacement physique renseigné.`,
        type: 'warning',
      });
    }

    const withoutDepartment = this.documents.filter(
      (doc) => !String(doc.dept_id ?? '').trim(),
    ).length;

    if (withoutDepartment > 0) {
      alerts.push({
        icon: 'business',
        text: `${withoutDepartment} document(s) n'ont pas de département renseigné.`,
        type: 'info',
      });
    }

    if (alerts.length === 0) {
      alerts.push({
        icon: 'check_circle',
        text: 'Aucune alerte détectée dans les données chargées.',
        type: 'info',
      });
    }

    this.alerts = alerts;
  }

  private buildRecentActivity(): void {
    const activities: Activity[] = [];

    for (const doc of this.documents) {
      const date = this.toDate(doc.created_at);

      if (date) {
        activities.push({
          icon: 'description',
          text: `Document ajouté : ${doc.title}`,
          date,
        });
      }
    }

    for (const movement of this.movements) {
      const borrowDate = this.toDate(movement.borrowDate);

      if (borrowDate) {
        activities.push({
          icon: 'assignment_returned',
          text: `Emprunt : ${movement.documentTitle} — ${movement.borrower}`,
          date: borrowDate,
        });
      }

      const returnDate = this.toDate(movement.returned_at);

      if (returnDate && this.isReturned(movement)) {
        activities.push({
          icon: 'check_circle',
          text: `Retour enregistré : ${movement.documentTitle}`,
          date: returnDate,
        });
      }
    }

    this.recentActivity = activities
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 6);
  }

  private countBy<T>(
    items: T[],
    getKey: (item: T) => unknown,
    fallback: string,
  ): Record<string, number> {
    const result: Record<string, number> = {};

    for (const item of items) {
      const raw = String(getKey(item) ?? '').trim();
      const key = raw || fallback;
      result[key] = (result[key] ?? 0) + 1;
    }

    return result;
  }

  private topEntries(counts: Record<string, number>, limit: number): [string, number][] {
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit);
  }

  private toDate(value: unknown): Date | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    const date = value instanceof Date ? value : new Date(value as string | number);

    return Number.isNaN(date.getTime()) ? null : date;
  }

  private startOfToday(): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }
}
