var db_A = openDatabase('db_A', '1.0', 'Sistema de Registro', 5 * 1024 * 1024);
if(!db_A){
    alert('Lo siento tu navegado NO soporta BD locales.');
}
var app = new Vue({
    el: '#appAlumno',
    data: {
        alumnos:[],
        buscar:'',
        alumno: {
            accion: 'nuevo',
            msg : '',
            idAlumno: '',
            codigo: '',
            nombre: '',
            apellido: '',
            direccion: '',
            telefono: '',
            email: '',
            fechan:'',
            matricula:'',
            idMatricula:'',
            carrera:'',
            fechai:''

        },
    
    },
    methods: {
        buscarAlumno(){
        
            this.obtenerAlumnos(this.buscar);
        },

        guardarAlumno(){
            let sql = '',
            parametros = [];
        if(this.alumno.accion == 'nuevo'){
            sql = 'INSERT INTO alumnos (codigo, nombre, apellido, direccion, telefono, email, fechan) VALUES (?,?,?,?,?,?,?)';
            parametros = [this.alumno.codigo,this.alumno.nombre,this.alumno.apellido,this.alumno.direccion,this.alumno.telefono,this.alumno.email,this.alumno.fechan];
        }else if(this.alumno.accion == 'modificar'){
            sql = 'UPDATE alumnos SET codigo=?, nombre=?, apellido=?, direccion=?, telefono=?, email=?, fechan=? WHERE idAlumno=?';
            parametros = [this.alumno.codigo,this.alumno.nombre,this.alumno.apellido,this.alumno.direccion,this.alumno.telefono,this.alumno.email,this.alumno.fechan,this.alumno.idAlumno];
        }else if(this.alumno.accion == 'eliminar'){
            sql = 'DELETE FROM alumnos WHERE idAlumno=?';
            parametros = [this.alumno.idAlumno];
        }
        db_A.transaction(tx=>{
            tx.executeSql(sql,
                parametros,
            (tx, results)=>{
                this.alumno.msg = 'Alumno procesado con exito';
                this.nuevoAlumno();
                this.obtenerAlumnos();
            },
            (tx, error)=>{
                switch(error.code){
                    case 6:
                        this.alumno.msg='El codigoya existe, por favor digite otro ';
                    
                        break;
                       
                    default:
                        this.alumno=`Error al procesar el alumno: ${error.message}`;

                }
                
            });
        });
    },
    modificarAlumno(data){
        this.alumno = data;
        this.alumno.accion = 'modificar';
    },
    eliminarAlumno(data){
        if( confirm(`¿Esta seguro de eliminar el Alumno ${data.nombre}?`) ){
            this.alumno.idAlumno = data.idAlumno;
            this.alumno.accion = 'eliminar';
            this.guardarAlumno();
        }
    },
    obtenerAlumnos(busqueda=''){
        db_A.transaction(tx=>{
            tx.executeSql(`SELECT * FROM alumnos WHERE nombre like "%${busqueda}%" OR codigo like "%${busqueda}%"`, [], (tx, results)=>{
                this.alumnos = results.rows;
             
            });
        });
    },
        nuevoAlumno(){
            this.alumno.accion = 'nuevo';
            this.alumno.idAlumno = '';
            this.alumno.codigo = '';
            this.alumno.nombre = '';
            this.alumno.apellido = '';
            this.alumno.direccion = '';
            this.alumno.telefono = '';
            this.alumno.email = '';
            this.alumno.fechan='';
            this.alumno.msg='';
            console.log(this.alumno)
        }
    },
    created(){
        db_A.transaction(tx=>{
            tx.executeSql('CREATE TABLE IF NOT EXISTS alumnos (idAlumno INTEGER PRIMARY KEY AUTOINCREMENT, '+
                'codigo char(10) unique, nombre char(75), apellido char(75), direccion TEXT, telefono char(10), email char(75), fechan date)');
        }, err=>{
            console.log('Error al crear la tabla de alumnos', err);
        });
        this.obtenerAlumnos();
    }
});