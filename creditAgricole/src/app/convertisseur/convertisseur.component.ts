import { Component } from '@angular/core';
import { Observable, Observer, materialize } from 'rxjs';

@Component({
  selector: 'app-convertisseur',
  templateUrl: './convertisseur.component.html',
  styleUrls: ['./convertisseur.component.scss'],
})
export class ConvertisseurComponent {
  taux = 1.1;
  euroToDallar = true;
  activatedEnteredTaux = false;
  tauxEntree = 0;
  leftInput: inputSide = {
    name: 'Euro',
    className: 'bi bi-currency-euro',
    value: 0,
  };
  rightInput: inputSide = {
    name: 'Dollar',
    className: 'bi bi-currency-dollar',
    value: 0,
  };
  counter = 0;
  historique = new Array();
  tauxObserver = new Observable((observer: Observer<number>) => {
    let marge = 0;
    setInterval(() => {
      marge = parseFloat((Math.random() * (0.05 + 0.05) - 0.05).toFixed(2));
      observer.next(marge);
    }, 3000);
  });
  ngOnInit() {
    this.tauxObserver.subscribe((marge: number) => {
      this.taux = parseFloat((this.taux + marge).toFixed(2));
      this.exchange();
    });
  }

  switchEuroDollar() {
    this.euroToDallar = !this.euroToDallar;
    let objLeft = this.leftInput;
    let objRight = this.rightInput;
    this.leftInput = {
      name: objRight.name,
      className: objRight.className,
      value: objRight.value,
    };
    this.rightInput = {
      name: objLeft.name,
      className: objLeft.className,
      value: objLeft.value,
    };
  }
  exchange() {
    if (this.leftInput.value != 0 && this.leftInput.value) {
      this.counter++;
      let margeExchange: number;
      this.verifTauxEchangeEntree();
      this.activatedEnteredTaux
        ? (margeExchange = this.tauxEntree)
        : (margeExchange = this.taux);
      if (this.euroToDallar) {
        this.rightInput.value = parseFloat(
          (this.leftInput.value * margeExchange).toFixed(2)
        );
      } else {
        this.rightInput.value = parseFloat(
          (this.leftInput.value / margeExchange).toFixed(2)
        );
      }
      let objH: Object = new Object({
        from: this.leftInput.name,
        to: this.rightInput.name,
        value: this.leftInput.value,
        result: this.rightInput.value,
        time: Date.now(),
        taux: margeExchange,
      });
      this.historique.unshift(objH);
      if (this.historique.length > 5) {
        this.historique = this.historique.slice(
          this.historique.length - 6,
          this.historique.length - 1
        );
      }
    } else {
      this.rightInput.value = 0;
    }
  }
  activeDesactiveTaux() {
    if (this.activatedEnteredTaux == true) {
      this.activatedEnteredTaux = false;
    } else {
      if (!this.verifTauxEchangeEntree()) {
      } else {
        this.activatedEnteredTaux = true;
        this.exchange();
      }
    }
  }
  onChangeInputTaux() {
    if (this.tauxEntree == 0) this.activatedEnteredTaux = false;
    if (!this.verifTauxEchangeEntree()) {
      this.activatedEnteredTaux = false;
    } else {
      if (this.activatedEnteredTaux) this.exchange();
    }
  }
  verifTauxEchangeEntree() {
    if (
      this.tauxEntree > this.taux + this.taux * 0.02 ||
      this.tauxEntree < this.taux - this.taux * 0.02
    ) {
      this.activatedEnteredTaux = false;
      return false;
    } else {
      return true;
    }
  }
}
export class inputSide {
  'name': string;
  'className': string;
  'value': number;
}
