export class Contacto {
    constructor() {


    }

    Nombre: string = "";
    Apellidos: string = "";
    Telefono: string = "";
    Pais: string = "";
}

export class Usuario {

    constructor() {


    }

    UsuarioID = "";
    Usuario = "";
    Nombre = "";
    Contrasena = "";
    Perfil = "https://cdn-icons-png.flaticon.com/512/8345/8345328.png";

    setData(data: any) {
        this.UsuarioID = data.UsuarioID;
        this.Usuario = data.Usuario;
        this.Nombre = data.Nombre;
        this.Contrasena = data.Contrasena;



    }
}


// Clase Servicios
export class Servicios {
    id: string = ""; // Identificador único del servicio (categorias)
    idPerfilProfesional: string = ""; // ID del perfil profesional que ofrece el servicio
    nombreServicio: string = ""; // Nombre del servicio ofrecido (carpinteria ejemplo)
    descripcion: string = ""; // Descripción detallada del servicio
    estado: string = "activo"; // Estado actual del servicio

    constructor(data: any) {
        this.setData(data);
    }

    setData(data: any) {
        this.id = data.id;
        this.idPerfilProfesional = data.idPerfilProfesional;
        this.nombreServicio = data.nombreServicio;
        this.descripcion = data.descripcion;
        this.estado = data.estado || "activo";
    }
}
