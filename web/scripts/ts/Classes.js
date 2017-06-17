'use strict'

var map = {
  required: 'Ce champs est obligatoire',
  link: 'Le lien de l\'illustration doit être une image',
  number: 'Ce champs doit être un nombre',
  email: 'Ce champs doit être une adresse valide',
  date: 'La date doit être valide'
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
      if(required){this.errors["required"] = errorMessage?errorMessage:map.required}
      if(validator){this.errors[validator] = map[validator]}
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
      if(required){this.errors["required"] = errorMessage?errorMessage:map.required}
      if(validator){this.errors[validator] = map[validator]}
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
