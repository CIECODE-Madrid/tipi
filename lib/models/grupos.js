Schema = {};

Schema.Grupo = new SimpleSchema({
    nombre: {
        type: String,
        label: 'Nombre completo',
    },
    acronimo: {
        type: String,
        label: 'Acrónimo',
    },
    imagen: {
        type: String,
        label: 'Url del logo',
        optional: true
    },
    activo: {
        type: Boolean,
        label: 'Activo?'
    }
});


Grupos = new Meteor.Collection('grupos', {'idGeneration': 'MONGO'});

Grupos.attachSchema(Schema.Grupo);
