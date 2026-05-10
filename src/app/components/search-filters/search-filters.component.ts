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
  garageOptions   = [1, 2, 3, 4];

  // Price slider constants
  readonly PRICE_MIN  = 0;
  readonly PRICE_MAX  = 50000000;
  readonly PRICE_STEP = 50000;
  readonly GAP        = 100000; // minimum gap between handles

  priceMinValue = 0;
  priceMaxValue = 50000000;

  get minPercent(): number {
    return (this.priceMinValue / this.PRICE_MAX) * 100;
  }

  get maxPercent(): number {
    return (this.priceMaxValue / this.PRICE_MAX) * 100;
  }

  get hasActiveFilters(): boolean {
    const nonPriceActive = [
      this.filters.bedroomsMin, this.filters.bedroomsMax,
      this.filters.bathroomsMin, this.filters.bathroomsMax,
      this.filters.carSpacesMin, this.filters.carSpacesMax,
    ].some(v => v !== null);
    const priceActive = this.priceMinValue > this.PRICE_MIN || this.priceMaxValue < this.PRICE_MAX;
    return nonPriceActive || priceActive;
  }

  onMinSlider(event: Event): void {
    const val = Number((event.target as HTMLInputElement).value);
    this.priceMinValue = Math.min(val, this.priceMaxValue - this.GAP);
    this.syncPriceFilters();
  }

  onMaxSlider(event: Event): void {
    const val = Number((event.target as HTMLInputElement).value);
    this.priceMaxValue = Math.max(val, this.priceMinValue + this.GAP);
    this.syncPriceFilters();
  }

  private syncPriceFilters(): void {
    this.filters.priceMin = this.priceMinValue > this.PRICE_MIN ? this.priceMinValue : null;
    this.filters.priceMax = this.priceMaxValue < this.PRICE_MAX ? this.priceMaxValue : null;
    this.onFilterChange();
  }

  onFilterChange(): void {
    this.filtersChange.emit({ ...this.filters });
  }

  clearAll(): void {
    this.filters = { ...EMPTY_FILTERS };
    this.priceMinValue = this.PRICE_MIN;
    this.priceMaxValue = this.PRICE_MAX;
    this.filtersChange.emit({ ...this.filters });
  }

  formatPrice(value: number): string {
    if (value === 0) return '$0';
    if (value >= 1000000) return `$${(value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  }
}
