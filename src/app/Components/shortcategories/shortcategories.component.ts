import { Component, OnInit } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

interface Servicio {
  id: string;
  Image: string;
  [key: string]: any;
}

@Component({
  selector: 'app-shortcategories',
  templateUrl: './shortcategories.component.html',
  styleUrls: ['./shortcategories.component.css']
})
export class ShortcategoriesComponent implements OnInit {
  servicios$!: Observable<Servicio[]>; 

  constructor(private firestore: Firestore, private router: Router) {}

  ngOnInit() {
    const serviciosCollection = collection(this.firestore, 'Servicios');
    this.servicios$ = collectionData(serviciosCollection, { idField: 'id' });
  }

  onCardClick(servicio: Servicio) {
  }
}
