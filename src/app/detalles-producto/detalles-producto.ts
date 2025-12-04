import { Component, OnInit } from '@angular/core';
import { Producto } from '../modelos/Producto';
import { ProductoService } from '../servicios/ProductoService';
import { ActivatedRoute } from '@angular/router';
import {CommonModule, NgIf} from '@angular/common';
import { Navbar } from '../navbar/navbar';
import { Footer } from '../footer/footer';
import { opinionesService } from '../servicios/opinionesService';
import { Opiniones } from '../modelos/Opiniones';
import { FormsModule } from '@angular/forms';
import {CarritoService} from '../servicios/CarritoService';
import Swal from 'sweetalert2';
import {PerfilService} from '../servicios/perfil.service';
import {Usuario} from '../modelos/Usuario';

@Component({
  selector: 'app-detalles-producto',
  templateUrl: './detalles-producto.html',
  imports: [CommonModule, FormsModule, Navbar, Footer, NgIf]
})
export class DetallesProducto implements OnInit {
  producto!: Producto;

  constructor(
    private route: ActivatedRoute,
    private productoService: ProductoService,
    private opinionesService: opinionesService,
    private carritoService: CarritoService,
    private perfilService: PerfilService,
  ) {}

  // -------------- OPINIONES --------------
  editando = false;
  editandoId: number | null = null;

  opiniones: Opiniones[] = [];
  cargando = false;
  errorMensaje = '';
  usuarioId!: number;
  nivel!: string;


  // Formulario para creación y edición
  formModel: Opiniones = {
    productoId: undefined,
    opinion: undefined,
    comentario: '',
    nombreUsuario: ''
  };

  //Este es el rating de las sparks
  selectedRating = 5;

  //------------------------------------------

  //                           -------- PRODUCTOS---------
  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    // obtener usuarioId del token
    this.perfilService.getMiPerfil().subscribe({
      next: (usuario: Usuario) => {
        this.usuarioId = usuario.id!;
        this.nivel = usuario.nivel || '';
        this.formModel.nombreUsuario = usuario.nombre || 'Invitado';
      }
    });


    // cargar producto y luego las opiniones
    this.productoService.getProductoPorId(id).subscribe({
      next: data => {
        this.producto = data;
        // fijar productoId en el form para crear reseñas
        if (this.producto && this.producto.id) {
          this.formModel.productoId = this.producto.id;
          this.cargarOpis(this.producto.id);
        }
      }
    });
  }

  //                     -------------- OPINIONES ------------------

  //Aca cargo las opiniones del backend por productoId
  cargarOpis(productoId: number) {
    this.cargando = true;
    this.opinionesService.getByProducto(productoId).subscribe({  //subscribe es para manejar la respuesta asincronica
      next: (list: Opiniones[]) => {
        this.opiniones = list;
        this.cargando = false;
      }
    });
  }

  //Selecciono el numero de estrellas
  setRating(numero: number) {
    this.selectedRating = numero;
    this.formModel.opinion = numero;
  }

  agregarAlCarrito(idProducto: number){
    this.carritoService.anyadirProductoCarrito(idProducto).subscribe({
      next: (data) => {
        Swal.fire({
          icon: 'success',
          title: 'Producto añadido al carrito',
          showConfirmButton: false,
          timer: 1500
        })
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al añadir el producto al carrito',
          text: error.message || 'Ha ocurrido un error inesperado',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#dc2626'
        })
      }
    });
  }

  //Aca esta el metodo para crear la reseña (para hacer una nueva)
  hacerReview() {

    this.errorMensaje = '';

    // validación mínima
    if (this.formModel.opinion == null) {
      this.errorMensaje = 'Selecciona una puntuación';
      return;
    }
    if (!this.formModel.comentario || this.formModel.comentario.trim().length < 5) {
      this.errorMensaje = 'El comentario debe tener al menos 5 caracteres';
      return;
    }

    const nuevaOpinion: Opiniones = {
      productoId: this.formModel.productoId,
      opinion: this.selectedRating,
      comentario: this.formModel.comentario,
      nombreUsuario: this.formModel.nombreUsuario,
      idUsuario: this.usuarioId
    };

    this.opinionesService.create(nuevaOpinion).subscribe({
      next: (created: Opiniones) => {
        this.opiniones.unshift(created); //Agrego la nueva opinión al inicio de la lista
        // Reinicia el formulario
        this.formModel = {
          productoId: this.producto.id,
          opinion: undefined,
          comentario: '',
          nombreUsuario: '' ,
        };
        this.selectedRating = 5; //Reinicia la calificación seleccionada
      },
      error: (err: any) => {
        console.error('Error creando opinión', err);
        this.errorMensaje = 'No se pudo crear la opinión';
      }
    })
  }

  //Metodo para editar una reseña
  editReview(opinion: Opiniones) {
    if(opinion.idUsuario !== this.usuarioId){
      this.errorMensaje = 'No puedes editar opiniones de otros usuarios.';
      return;
    }
    this.editando = true;
    this.editandoId = opinion.id || null;
    this.formModel = { ...opinion }; //Copia los datos de la opinión al formulario
    this.selectedRating = opinion.opinion || 5; //Aseguro que el rating se refleje en el formulario
  }

  //Metodo para actualizar la reseña
  updateReview() {
    if (this.editandoId === null) {
      this.errorMensaje = 'No hay ninguna opinión seleccionada para editar.';
      return;
      if(this.formModel.idUsuario !== this.usuarioId){
        this.errorMensaje = 'No puedes editar opiniones de otros usuarios.';
        return;
      }
    }

    this.opinionesService.update(this.editandoId, this.formModel).subscribe({
      next: (updated: Opiniones) => {
        const index = this.opiniones.findIndex(op => op.id === this.editandoId);
        if (index !== -1) {
          this.opiniones[index] = updated;
        }
      }
    });
  }

  //Metodo para eliminar una reseña
  deleteReview(id?: number) {
    const opinion = this.opiniones.find(op => op.id === id);

    // Si no existe, ignoro
    if (!opinion) return;

    // REGLA:
    // Si NO soy el dueño Y NO soy ADMIN → rechazo
    if (opinion.idUsuario !== this.usuarioId && this.nivel !== 'ADMIN') {
      this.errorMensaje = 'No puedes eliminar opiniones de otros usuarios.';
      return;
    }

    if (!confirm('¿Eliminar opinión?')) return;

    this.opinionesService.delete(id!).subscribe({
      next: () => {
        this.opiniones = this.opiniones.filter(op => op.id !== id);
      },
      error: (err: any) => {
        console.error('Error borrando opinion', err);
        this.errorMensaje = 'No se pudo eliminar la opinión';
      }
    });
  }




  //Metodo para hacer la media de las estrellas de un productoId
  calcularMediaUnaOpinion(productoId: number): number {
    const opinionesProducto = this.opiniones.filter(op => op.productoId === productoId);
    if (opinionesProducto.length === 0)
      return 0;

    const suma = opinionesProducto.reduce((acc, op) => acc + (op.opinion || 0), 0);
    return suma / opinionesProducto.length;
  }

  iconosTipo: {[key:string] :string} = {
    NORMAL: '../assets/Tipo/normal.png',
    FUEGO: '../assets/Tipo/fuego.png',
    AGUA: '../assets/Tipo/agua.png',
    ELECTRICO: '../assets/Tipo/electrico.png',
    PLANTA: '../assets/Tipo/planta.png',
    HIELO: '../assets/Tipo/hielo.png',
    LUCHA: '../assets/Tipo/lucha.png',
    VENENO: '../assets/Tipo/veneno.png',
    TIERRA: '../assets/Tipo/tierra.png',
    VOLADOR: '../assets/Tipo/volador.png',
    PSIQUICO: '../assets/Tipo/psiquico.png',
    BICHO: '../assets/Tipo/bicho.png',
    ROCA: '../assets/Tipo/roca.png',
    FANTASMA: '../assets/Tipo/fantasma.png',
    DRAGON: '../assets/Tipo/dragon.png',
    SINIESTRO: '../assets/Tipo/siniestro.png',
    ACERO: '../assets/Tipo/acero.png',
    HADA: '../assets/Tipo/hada.png'

  }
}
