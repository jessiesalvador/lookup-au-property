import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PropertyFilters, EMPTY_FILTERS } from '../../models/filters.model';

@Component({
  selector: 'app-search-filters',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
  ],
  templateUrl: './search-filters.component.html',
  styleUrls: ['./search-filters.component.scss']
})
export class SearchFiltersComponent {
  @Input() totalResults = 0;
  @Input() filteredResults = 0;
  @Output() filtersChange = new EventEmitter<PropertyFilters>();

  filters: PropertyFilters = { ...EMPTY_FILTERS };

  bedroomOptions = [1, 2, 3, 4, 5, 6];
  bathroomOptions = [1, 2, 3, 4];
  garageOptions = [1, 2, 3, 4];

  // Price button options — min side and max side
  priceMinOptions = [
    { label: '$0',        value: 0 },
    { label: '$250K',     value: 250000 },
    { label: '$500K',     value: 500000 },
    { label: '$750K',     value: 750000 },
    { label: '$1M',       value: 1000000 },
    { label: '$1.5M',     value: 1500000 },
    { label: '$2M',       value: 2000000 },
    { label: '$3M',       value: 3000000 },
    { label: '$5M',       value: 5000000 },
    { label: '$10M',      value: 10000000 },
  ];

  priceMaxOptions = [
    { label: '$250K',     value: 250000 },
    { label: '$500K',     value: 500000 },
    { label: '$750K',     value: 750000 },
    { label: '$1M',       value: 1000000 },
    { label: '$1.5M',     value: 1500000 },
    { label: '$2M',       value: 2000000 },
    { label: '$3M',       value: 3000000 },
    { label: '$5M',       value: 5000000 },
    { label: '$10M',      value: 10000000 },
    { label: '$50M',      value: 50000000 },
  ];

  get hasActiveFilters(): boolean {
    return Object.values(this.filters).some(v => v !== null);
  }

  onFilterChange(): void {
    this.filtersChange.emit({ ...this.filters });
  }

  selectPriceMin(value: number): void {
    this.filters.priceMin = value === 0 ? null : value;
    // If min > max, clear max
    if (this.filters.priceMin !== null && this.filters.priceMax !== null
        && this.filters.priceMin >= this.filters.priceMax) {
      this.filters.priceMax = null;
    }
    this.onFilterChange();
  }

  selectPriceMax(value: number): void {
    this.filters.priceMax = value;
    // If max < min, clear min
    if (this.filters.priceMin !== null && this.filters.priceMax !== null
        && this.filters.priceMax <= this.filters.priceMin) {
      this.filters.priceMin = null;
    }
    this.onFilterChange();
  }

  isPriceMinActive(value: number): boolean {
    if (value === 0) return this.filters.priceMin === null || this.filters.priceMin === 0;
    return this.filters.priceMin === value;
  }

  isPriceMaxActive(value: number): boolean {
    return this.filters.priceMax === value;
  }

  clearAll(): void {
    this.filters = { ...EMPTY_FILTERS };
    this.filtersChange.emit({ ...this.filters });
  }
}
