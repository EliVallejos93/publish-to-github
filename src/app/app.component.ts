import { Component } from '@angular/core';
import { LongitudLatitudService } from 'src/app/services/LongitudLatitud.service';
import { DatosClimaService } from 'src/app/services/DatosClima.service';
import { paises } from 'src/app/shared/list-paises';
import { provincias } from 'src/app/shared/list-provincias';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [MessageService]
})

export class AppComponent {
  seleccionoApp = 'clima';
  paisesTodos = paises;
  paisSelect = '';
  provinciasDePais: any[] = [];
  provinciaSelect = '';
  datosClimaRespuesta: any;
  spinner = false;
  today: Date = new Date();
  dias: string[] = [];
  // iconos: string[] = [];
  icono = "https://v5i.tutiempo.net/wi/02/90/7.png";

  constructor(private LongitudLatitud: LongitudLatitudService,
    private DatosClima: DatosClimaService,
    private messageService: MessageService) {
    this.agregarDiasSiguientes();
  }
  ngOnInit() {
    this.messageService.add({ key: "msg", severity: 'success', summary: 'Éxito', detail: 'La operación se ha completado correctamente.' });
  }

  agregarDiasSiguientes() {
    for (let i = 0; i < 5; i++) {
      const nextDay = new Date(this.today);
      nextDay.setDate(nextDay.getDate() + i + 1);
      this.dias.push(this.getDayOfWeek(nextDay));
    }
  }

  getDayOfWeek(date: Date): string {
    const daysOfWeek: string[] = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return daysOfWeek[date.getDay()];
  }

  selectApp(app: string) {
    this.seleccionoApp = app;
    this.messageService.add({ key: "msg", severity: 'success', summary: 'Éxito', detail: 'La operación se ha completado correctamente.' });
  }

  seleccionaPais() {
    this.datosClimaRespuesta = null;
    this.provinciasDePais = [];
    let idPais: any;
    idPais = paises.find(p => p.name == this.paisSelect);
    provincias.forEach((e: any) => {
      if (e.id_country == idPais.id) this.provinciasDePais.push(e);
    });
  }

  buscarClima() {
    this.spinner = true;
    this.LongitudLatitud.get(this.provinciaSelect).subscribe((res: any) => {
      this.DatosClima.get(res[0].lat, res[0].lon).subscribe((res: any) => {
        // if (res.error) 

        this.datosClimaRespuesta = res;
        console.log('this.datosClimaRespuesta');
        console.log(this.datosClimaRespuesta);
        // this.iconos.push(this.datosClimaRespuesta.day1.icon);
        // this.iconos.push(this.datosClimaRespuesta.day2.icon);
        // this.iconos.push(this.datosClimaRespuesta.day3.icon);
        // this.iconos.push(this.datosClimaRespuesta.day4.icon);
        // this.iconos.push(this.datosClimaRespuesta.day5.icon);
        // this.iconos.push(this.datosClimaRespuesta.day6.icon);
        this.spinner = false;
      });
    });
  }
}
