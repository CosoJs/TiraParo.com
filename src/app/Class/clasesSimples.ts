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
