
function validarNitGuatemala(valor) {
  if (typeof valor !== 'string') {
    return false;
  }

  const nit = valor.trim().toUpperCase();
  const coincidencia = /^([0-9]+)-([0-9K])$/.exec(nit);

  if (!coincidencia) {
    return false;
  }

  const numeros = coincidencia[1];
  const verificador = coincidencia[2];

  let suma = 0;
  let peso = numeros.length + 1;

  for (const digito of numeros) {
    suma += Number(digito) * peso;
    peso--;
  }

  const resultado = 11 - (suma % 11);

  const esperado =
    resultado === 11 ? '0' :
    resultado === 10 ? 'K' :
    String(resultado);

  return esperado === verificador;
}

module.exports = { validarNitGuatemala };
