import { Component } from '@angular/core';
import { LongitudLatitudService } from 'src/app/services/LongitudLatitud.service';
import { DatosClimaService } from 'src/app/services/DatosClima.service';
import { paises } from 'src/app/shared/list-paises';
import { provincias } from 'src/app/shared/list-provincias';
import { ClientesService } from 'src/app/services/Clientes.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent {
  seleccionoApp = '';
  paisesTodos = paises;
  paisSelect = '';
  provinciasDePais: any[] = [];
  provinciaSelect = '';
  datosClimaRespuesta: any;
  spinner = false;
  today: Date = new Date();
  dias: string[] = [];
  iconos: string[] = [];
  clienteNombre: any;
  clienteApellido: any;
  clienteFechaNacimiento: any;
  clienteCuit: any;
  clienteDomicilio: any;
  clienteTelefono: any;
  clienteEmail: any;
  clienteId: any;
  clientes: any[] = [];

  modal = {
    visible: false,
    tipo: "",
    titulo: "",
    contenido: ""
  };

  constructor(private LongitudLatitud: LongitudLatitudService,
    private DatosClima: DatosClimaService,
    private ClientesService: ClientesService) {
    this.agregarDiasSiguientes();
    this.showAlert('', 'Hola', 'Bienvenido a mi app');
  }

  showAlert(tipoA: any, tituloA: any, contenidoA: any) {
    this.modal = {
      visible: true,
      tipo: tipoA,
      titulo: tituloA,
      contenido: contenidoA
    };
    setTimeout(() => {
      this.modal.visible = false;
    }, 2000);
  }

  selectApp(app: string) {
    this.seleccionoApp = app;
    this.paisSelect = '';
    this.provinciaSelect = '';
    this.datosClimaRespuesta = null;
    this.provinciasDePais = [];
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
      if (res && res[0] && res[0].lat && res[0].lon) {
        this.DatosClima.get(res[0].lat, res[0].lon).subscribe((res: any) => {
          if (res && !res.error) {
            this.datosClimaRespuesta = res;
            this.iconos.push(this.datosClimaRespuesta.day1.icon);
            this.iconos.push(this.datosClimaRespuesta.day2.icon);
            this.iconos.push(this.datosClimaRespuesta.day3.icon);
            this.iconos.push(this.datosClimaRespuesta.day4.icon);
            this.iconos.push(this.datosClimaRespuesta.day5.icon);
            this.iconos.push(this.datosClimaRespuesta.day6.icon);
            this.showAlert('OK', 'Excelente!', 'Respuesta Exitosa.');
            this.spinner = false;
          } else this.showAlert('ERR', 'Ups!', 'Ocurrio un problema. Intentaremos solucionarlo a la brevedad.');
        });
      } else this.showAlert('ERR', 'Ups!', 'Ocurrio un problema. Intentaremos solucionarlo a la brevedad.');
    });
  }


  guardarCliente() {
    console.log('this.clienteFechaNacimiento');
    console.log(this.clienteFechaNacimiento);

    if (this.validCliente()) {
      this.spinner = true;
      let body = {
        id: 0,
        nombre: this.clienteNombre,
        apellido: this.clienteApellido,
        fechaNacimiento: this.clienteFechaNacimiento,
        cuit: this.clienteCuit,
        domicilio: this.clienteDomicilio,
        telefono: this.clienteTelefono,
        email: this.clienteEmail
      };
      // aca tengo que preguntar si hay id es una actualizacion, sion es nuevo
      console.log('this.clienteId');
      console.log(this.clienteId);
      //si tiene id es edicion, sino es nuevo.
      if (this.clienteId) {
        console.log('Editar');
        body.id = this.clienteId;
        console.log('body');
        console.log(body);
        this.ClientesService.Update(body).subscribe((res: any) => {
          this.spinner = false;
          this.showAlert(res.code, res.code, res.message);
        }, err => {
          this.spinner = false;
          this.showAlert(err.error.code, err.error.code, err.error.message);
        });
      } else {
        console.log('Nuevo');
        this.ClientesService.Insert(body).subscribe((res: any) => {
          this.spinner = false;
          this.showAlert(res.code, res.code, res.message);
        }, err => {
          this.spinner = false;
          this.showAlert(err.error.code, err.error.code, err.error.message);
        });
      }
    } else this.showAlert('WARN', 'Ups!', 'Debe completar correctamente el formulario.');
  }

  validCliente() {
    if (!this.clienteNombre) return false;
    if (!this.clienteApellido) return false;
    if (!this.clienteFechaNacimiento) return false;
    if (!this.clienteCuit) return false;
    if (!this.clienteDomicilio) return false;
    if (!this.clienteTelefono) return false;
    if (!this.clienteEmail) return false;
    return true;
  }

  traerClientesTodos() {
    this.ClientesService.GetAll().subscribe((res: any) => {
      this.clientes = res.message;
    });;
  }

  buscarCliente() {
    if (this.clienteNombre) {
      this.ClientesService.Search(this.clienteNombre).subscribe((res: any) => {
        if (res.code == 'OK') {
          // conversion de formato de fecha
          var fecha = new Date(res.message.fechaNacimiento);
          var año = fecha.getFullYear();
          var mes = ("0" + (fecha.getMonth() + 1)).slice(-2); // Añade ceros a la izquierda si es necesario
          var dia = ("0" + fecha.getDate()).slice(-2); // Añade ceros a la izquierda si es necesario
          var nuevoFormatoFecha = año + "-" + mes + "-" + dia;

          this.clienteNombre = res.message.nombre;
          this.clienteApellido = res.message.apellido;
          this.clienteFechaNacimiento = nuevoFormatoFecha;
          this.clienteCuit = res.message.cuit;
          this.clienteDomicilio = res.message.domicilio;
          this.clienteTelefono = res.message.telefono;
          this.clienteEmail = res.message.email;
          this.clienteId = res.message.id;
        }
      }, err => {
        this.showAlert(err.error.code, err.error.code, err.error.message);
      });
    } else this.showAlert('WARN', 'Ups!', 'Falta nombre del cliente para buscar.');
  }

  limpiar() {
    this.clienteNombre = null;
    this.clienteApellido = null;
    this.clienteFechaNacimiento = null;
    this.clienteCuit = null;
    this.clienteDomicilio = null;
    this.clienteTelefono = null;
    this.clienteEmail = null;
    this.clienteId = null;
    this.clientes = [];
  }
}
