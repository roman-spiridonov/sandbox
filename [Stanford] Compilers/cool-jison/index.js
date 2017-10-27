/**
 * Created by Roman Spiridonov <romars@phystech.edu> on 10/27/2017.
 */
const fs = require('fs');

var parser = require('./cool').parser;

let file = fs.readFileSync('./arith.cl', {encoding: 'utf-8'});
var lexer = parser.lexer;
lexer.setInput(file);

let r;
while(r = lexer.lex()) {
  console.log(r);
  if(r === 1)
    break;
}

let res = parser.parse(file);

console.log(JSON.stringify(res));
