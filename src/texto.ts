// @j3ehcmz/ui/texto — utilidades de texto puras (sirven en servidor y navegador, sin React).

/** Quita tildes y diéresis para comparar o buscar: «Josué Peña Ñuñez» → «Josue Pena Nunez». No cambia mayúsculas.
 *  Ojo: la ñ también pasa a n (lo que se quiere al buscar: «pena» encuentra «Peña»). */
export function sinAcentos(texto: string): string {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").normalize("NFC");
}

/** Para buscar: sin tildes, minúsculas y espacios colapsados. */
export function normalizar(texto: string): string {
  return sinAcentos(texto).toLowerCase().replace(/\s+/g, " ").trim();
}

const TITULOS = /^(dr|dra|lic|licda|ing|inga|sr|sra|srta|msc|mba|pem|arq)\.?$/i;

/** Iniciales de una persona: primera letra del primer nombre y de la ÚLTIMA palabra (el apellido que queda), en mayúsculas.
 *  Salta títulos (Dr., Licda., Ing.…) y lo que no empieza con letra («(correo)», números). Una sola palabra → sus dos
 *  primeras letras. Vacío → «?». «Dra. María José García López» → «ML»; «admin@» → «AD». */
export function iniciales(nombre: string, max: 1 | 2 = 2): string {
  const palabras = nombre
    .trim()
    .split(/\s+/)
    .filter((p) => p && !TITULOS.test(p) && /^\p{L}/u.test(p));
  if (palabras.length === 0) return "?";
  const primera = palabras[0]!;
  if (max === 1) return primera[0]!.toLocaleUpperCase("es");
  if (palabras.length === 1) {
    const letras = [...primera].filter((c) => /\p{L}/u.test(c));
    return letras.slice(0, 2).join("").toLocaleUpperCase("es");
  }
  return (primera[0]! + palabras[palabras.length - 1]![0]!).toLocaleUpperCase("es");
}
