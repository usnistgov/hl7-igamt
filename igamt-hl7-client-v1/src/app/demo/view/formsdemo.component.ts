import { Component, OnInit } from '@angular/core';
import { CountryService } from '../service/countryservice';
import { SelectItem, MenuItem } from 'primeng/primeng';
import { BreadcrumbService } from '../../breadcrumb.service';

@Component({
    templateUrl: './formsdemo.component.html'
})
export class FormsDemoComponent implements OnInit {

    country: any;

    filteredCountries: any[];

    brands: string[] = ['Audi', 'BMW', 'Fiat', 'Ford', 'Honda', 'Jaguar', 'Mercedes', 'Renault', 'Volvo', 'VW'];

    filteredBrands: any[];

    selectedBrands: string[];

    carOptions: SelectItem[];

    selectedMultiSelectCars: string[] = [];

    cities: SelectItem[];

    citiesListbox: SelectItem[];

    selectedCity1: any;

    selectedCity2: any;

    ratingValue: number;

    checkboxValues: string[] = [];

    radioValues: string[];

    switchChecked: boolean;

    rangeValues: number[] = [20, 80];

    toggleButtonChecked: boolean;

    types: SelectItem[];

    splitButtonItems: MenuItem[];

    radioValue: string;

    selectedType: string;

    color: string;

    constructor(private countryService: CountryService, private breadcrumbService: BreadcrumbService) {
        this.breadcrumbService.setItems([
            { label: 'Components' },
            { label: 'Forms', routerLink: ['/forms'] }
        ]);
    }

    ngOnInit() {
        this.carOptions = [];
        this.carOptions.push({ label: 'Audi', value: 'Audi' });
        this.carOptions.push({ label: 'BMW', value: 'BMW' });
        this.carOptions.push({ label: 'Fiat', value: 'Fiat' });
        this.carOptions.push({ label: 'Ford', value: 'Ford' });
        this.carOptions.push({ label: 'Honda', value: 'Honda' });
        this.carOptions.push({ label: 'Jaguar', value: 'Jaguar' });
        this.carOptions.push({ label: 'Mercedes', value: 'Mercedes' });
        this.carOptions.push({ label: 'Renault', value: 'Renault' });
        this.carOptions.push({ label: 'VW', value: 'VW' });
        this.carOptions.push({ label: 'Volvo', value: 'Volvo' });

        this.cities = [];
        this.cities.push({ label: 'Select City', value: 0 });
        this.cities.push({ label: 'New York', value: { id: 1, name: 'New York', code: 'NY' } });
        this.cities.push({ label: 'Rome', value: { id: 2, name: 'Rome', code: 'RM' } });
        this.cities.push({ label: 'London', value: { id: 3, name: 'London', code: 'LDN' } });
        this.cities.push({ label: 'Istanbul', value: { id: 4, name: 'Istanbul', code: 'IST' } });
        this.cities.push({ label: 'Paris', value: { id: 5, name: 'Paris', code: 'PRS' } });

        this.citiesListbox = this.cities.slice(1);

        this.types = [];
        this.types.push({ label: 'Apartment', value: 'Apartment' });
        this.types.push({ label: 'House', value: 'House' });
        this.types.push({ label: 'Studio', value: 'Studio' });

        this.splitButtonItems = [
            { label: 'Update', icon: 'fa-refresh' },
            { label: 'Delete', icon: 'fa-close' },
            { label: 'Home', icon: 'fa-home', url: 'http://www.primefaces.org/primeng' }
        ];
    }

    filterCountry(event) {
        const query = event.query;
        this.countryService.getCountries().then(countries => {
            this.filteredCountries = this.searchCountry(query, countries);
        });
    }

    searchCountry(query, countries: any[]): any[] {
        // in a real application, make a request to a remote url with the query and
        // return filtered results, for demo we filter at client side
        const filtered: any[] = [];
        for (let i = 0; i < countries.length; i++) {
            const country = countries[i];
            if (country.name.toLowerCase().indexOf(query.toLowerCase()) === 0) {
                filtered.push(country);
            }
        }
        return filtered;
    }

    filterBrands(event) {
        this.filteredBrands = [];
        for (let i = 0; i < this.brands.length; i++) {
            const brand = this.brands[i];
            if (brand.toLowerCase().indexOf(event.query.toLowerCase()) === 0) {
                this.filteredBrands.push(brand);
            }
        }
    }

    handleACDropdownClick() {
        this.filteredBrands = [];

        // mimic remote call
        setTimeout(() => {
            this.filteredBrands = this.brands;
        }, 100);
    }
}
