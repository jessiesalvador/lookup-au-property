import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

import { HeaderComponent } from './components/header/header.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { PropertyCardComponent } from './components/property-card/property-card.component';
import { PropertyDetailComponent } from './components/property-detail/property-detail.component';
import { PropertyService } from './services/property.service';
import { Property, PropertySearchResult } from './models/property.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    HeaderComponent,
    SearchBarComponent,
    PropertyCardComponent,
    PropertyDetailComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  results = signal<PropertySearchResult[]>([]);
  loading = signal(false);
  searched = signal(false);
  selectedProperty = signal<Property | null>(null);
  lastQuery = signal('');

  constructor(private propertyService: PropertyService) {}

  onSearch(query: string): void {
    if (!query) {
      this.results.set([]);
      this.searched.set(false);
      return;
    }
    this.loading.set(true);
    this.searched.set(false);
    this.lastQuery.set(query);
    this.selectedProperty.set(null);

    this.propertyService.search(query).subscribe({
      next: (res) => {
        this.results.set(res);
        this.loading.set(false);
        this.searched.set(true);
      },
      error: () => {
        this.results.set([]);
        this.loading.set(false);
        this.searched.set(true);
      }
    });
  }

  selectProperty(property: Property): void {
    this.selectedProperty.set(property);
  }

  closeDetail(): void {
    this.selectedProperty.set(null);
  }
}
