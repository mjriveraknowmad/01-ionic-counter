import { Component, signal } from '@angular/core';
import { IonHeader, IonContent, IonButton, IonFooter, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronUpOutline, chevronDownOutline } from 'ionicons/icons';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonHeader,
    IonContent,
    IonButton,
    IonFooter,
    IonIcon
  ],
})
export class HomePage {

  // Minimo y maximo permitidos, y Clave que usaremos para obtener/guardar nuestro numero
  public readonly MIN: number = 0;
  public readonly MAX: number = 9999;
  private readonly KEY_NUMBER: string = "counterApp_key_number";

  public num = signal(0);


  constructor() {
    // Iconos que vamos a usar, sino se añade no aparecen, desde Ionic 7
    addIcons({ chevronUpOutline, chevronDownOutline });
  }

  // Se ejecuta antes de que la vista entre en pantalla, es decir cuando se vaya a mostrar. Muy útil para inicializar datos antes de que el usuario vea la vista.
  async ionViewWillEnter() {

    // Obtenemos el numero guardado
    const counterPreferences = await Preferences.get({ key: this.KEY_NUMBER });

    // Si existe
    if (counterPreferences.value) {
      // Obtenemos el numero
      const num = +counterPreferences.value;
      // Si no es correcto, añadimos el valor mínimo
      if (isNaN(num) || num < this.MIN || num > this.MAX) {
        this.num.set(this.MIN);
        this.saveNum();
      } else {
        this.num.set(num);
      }
    }

  }


  up() {
    if (this.num() < this.MAX) {
      this.num.update( n => n + 1);
      this.saveNum();
    }
  }

  down() {
    if (this.num() > this.MIN) {
      this.num.update( n => n - 1);
      this.saveNum();
    }
  }

  saveNum() {
    // Guardamos el numero actual en las preferencias, usando capacitor
    // https://capacitorjs.com/docs/apis/preferences
    Preferences.set({ key: this.KEY_NUMBER, value: this.num().toString() });
  }

}
