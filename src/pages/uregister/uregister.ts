import { Component} from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

interface ToDo{
  
  consulta: string;
  doctor: string;
  precio: number;
  hora: number;
  id?: string;
}



@Component({
  selector: 'page-uregister',
  templateUrl: 'uregister.html',
})
export class UregisterPage {

  todoCollection: AngularFirestoreCollection<ToDo>;
  todo: ToDo[];

  constructor(public navCtrl: NavController,private asf: AngularFirestore, public alertCtrl: AlertController) {}

  ionViewDidEnter() {
    this.todoCollection = this.asf.collection('todo');
    this.todoCollection.snapshotChanges().subscribe(todoList => {
      this.todo = todoList.map(item =>{
        return{
          consulta: item.payload.doc.data().consulta,
          doctor: item.payload.doc.data().doctor,
          precio: item.payload.doc.data().precio,
          hora: item.payload.doc.data().hora,
          id: item.payload.doc.id
        }
      })
    })  
  }


newItem() {
let prompt = this.alertCtrl.create({
  title: 'Añadir Actividad',
  message: 'Ingresa la informacion solicitada',
    inputs : [{
      name: 'consulta',
      placeholder: 'Consulta'
    },{
      name: 'doctor',
      placeholder: 'Doctor'
    },{
      name: 'precio',
      placeholder: 'Precio'
    },{
      name: 'hora',
      placeholder: 'Hora'
    }],
  buttons: [{
      text: 'Cancelar'}, 
      {text: 'Guardar',
      handler: data => {this.addTask(data.consulta,data.doctor,data.precio,data.hora);}
}]
}).present();
} 

addTask(consulta:string,doctor:string,precio:number,hora:number){

  this.asf.collection('todo').add({consulta,doctor,precio,hora});
}


deleteItem(item: ToDo) {
this.asf.doc(`todo/${item.id}`).delete().then(() =>{
  console.log(`Tarea eliminada: "${item.id}"`);
}).catch(err =>{console.error(err);
})
}

}
