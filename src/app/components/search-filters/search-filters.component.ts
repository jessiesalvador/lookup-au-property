import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PropertyFilters, EMPTY_FILTERS } from '../../../models/filters.model';

@Component({
  selector: 'app-search-filters',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
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

  get hasActiveFilters(): boolean {
    return Object.values(this.filters).some(v => v !== null && v !== '');
  }

  onFilterChange(): void {
    this.filtersChange.emit({ ...this.filters });
  }

  clearAll(): void {
    this.filters = { ...EMPTY_FILTERS };
    this.filtersChange.emit({ ...this.filters });
  }

  // Prevent min > max inline
  clampMin(minKey: keyof PropertyFilters, maxKey: keyof PropertyFilters): void {
    const min = this.filters[minKey] as number | null;
    const max = this.filters[maxKey] as number | null;
    if (min !== null && max !== null && min > max) {
      (this.filters as any)[maxKey] = min;
    }
    this.onFilterChange();
  }
}
