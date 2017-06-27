'use strict'

var map = {
  required: 'Ce champs est obligatoire',
  linkImage: {
    link: 'Le lien de l\'illustration doit être valide',
    image: 'Le lien de l\'illustration doit renvoyer une image'
  },
  number: {
    number: 'Ce champs doit être un nombre'
  },
  email: {
    email: 'Ce champs doit être une adresse valide'
  },
  date: {
    date: 'La date doit être valide'
  },
  dateBetween: {
    start: 'La date de début doit être dans le futur',
    end: 'La date de fin'
  },
}


class textForm{
  constructor(placeholder, name, type, required, legend, source, init, validator, error, errorMessage){
    this.placeholder = placeholder;
    this.name = name;
    this.type = type;
    this.required = required;
    if (legend) {this.legend = legend}
    if (source) {this.source = source}
    if (init != null) {this.init = init}
    if (validator) {this.validator = validator}
    if(error){
      this.errors = {};
      if(validator){
        this.errors = map[validator];
      }
      if(required){this.errors["required"] = errorMessage?errorMessage:map.required}
    }
  }
}

class searchForm{
  constructor(placeholder, name, required, legend, source, validator, error, errorMessage){
    this.placeholder = placeholder;
    this.name = name;
    this.required = required;
    if (legend) {this.legend = legend}
    if (source) {this.source = source}
    if (validator) {this.validator = validator}
    if(error){
      this.errors = {};
      if(validator){
        this.errors = map[validator];
      }
      if(required){this.errors["required"] = errorMessage?errorMessage:map.required}
    }
  }
}

class ratingForm{
  constructor(name, required, init, editable){
    this.name = name;
    this.editable = editable;
    this.required = required;
    if (init != null) {this.init = init}
  }
}


class dateBetweenForm{
  constructor(startName, endName, legend1, legend2, required, error, errorMessage){
    this.startName = startName;
    this.endName = endName;
    this.legend1 = legend1;
    this.legend2 = legend2;
    this.required = required;
    this.validator = 'dateBetween';
    if(error){
      this.errors = {};
      this.errors = map[this.validator];
      if(required){this.errors["required"] = errorMessage?errorMessage:map.required}
    }
  }
}
