import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

import { HeaderComponent } from './components/header/header.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { PropertyCardComponent } from './components/property-card/property-card.component';
import { PropertyDetailComponent } from './components/property-detail/property-detail.component';
import { SearchFiltersComponent } from './components/search-filters/search-filters.component';
import { PropertyService } from './services/property.service';
import { Property, PropertySearchResult } from './models/property.model';
import { PropertyFilters, EMPTY_FILTERS } from './models/filters.model';

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
    SearchFiltersComponent,
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
  activeFilters = signal<PropertyFilters>({ ...EMPTY_FILTERS });

  // Derived: results after filters are applied
  filteredResults = computed(() => {
    const filters = this.activeFilters();
    return this.results().filter(({ property: p }) => {
      if (filters.bedroomsMin !== null && (p.bedrooms ?? 0) < filters.bedroomsMin) return false;
      if (filters.bedroomsMax !== null && (p.bedrooms ?? 0) > filters.bedroomsMax) return false;
      if (filters.bathroomsMin !== null && (p.bathrooms ?? 0) < filters.bathroomsMin) return false;
      if (filters.bathroomsMax !== null && (p.bathrooms ?? 0) > filters.bathroomsMax) return false;
      if (filters.carSpacesMin !== null && (p.carSpaces ?? 0) < filters.carSpacesMin) return false;
      if (filters.carSpacesMax !== null && (p.carSpaces ?? 0) > filters.carSpacesMax) return false;
      if (filters.priceMin !== null && (p.lastSalePrice ?? 0) < filters.priceMin) return false;
      if (filters.priceMax !== null && (p.lastSalePrice ?? 0) > filters.priceMax) return false;
      return true;
    });
  });

  constructor(private propertyService: PropertyService) {}

  onSearch(query: string): void {
    if (!query) {
      this.results.set([]);
      this.searched.set(false);
      this.activeFilters.set({ ...EMPTY_FILTERS });
      return;
    }
    this.loading.set(true);
    this.searched.set(false);
    this.lastQuery.set(query);
    this.selectedProperty.set(null);
    this.activeFilters.set({ ...EMPTY_FILTERS });

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

  onFiltersChange(filters: PropertyFilters): void {
    this.activeFilters.set(filters);
  }

  selectProperty(property: Property): void {
    this.selectedProperty.set(property);
  }

  closeDetail(): void {
    this.selectedProperty.set(null);
  }
}
