import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Property } from '../../models/property.model';

@Component({
  selector: 'app-property-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule],
  templateUrl: './property-card.component.html',
  styleUrls: ['./property-card.component.scss']
})
export class PropertyCardComponent {
  @Input() property!: Property;
  @Output() viewDetail = new EventEmitter<Property>();

  get propertyTypeIcon(): string {
    const icons: Record<string, string> = {
      'House': 'house',
      'Apartment': 'apartment',
      'Townhouse': 'holiday_village',
      'Unit': 'apartment',
      'Studio': 'meeting_room',
      'Land': 'landscape'
    };
    return icons[this.property.propertyType] ?? 'home';
  }

  formatPrice(value: number | null): string {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(value);
  }
}
