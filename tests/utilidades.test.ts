// bun test tests — utilidades puras (no se publican: «files» solo lleva src, css, fuentes).
import { describe, expect, test } from "bun:test";
import { duracion, hace } from "../src/tiempo/relativo";
import { iniciales, normalizar, sinAcentos } from "../src/texto";

// 8-nov-2026 15:00 en Guatemala (UTC−6) = 21:00 UTC.
const AHORA = Date.UTC(2026, 10, 8, 21, 0, 0);
const MIN = 60_000;
const H = 3600_000;

describe("hace", () => {
  test("menos de un minuto", () => {
    expect(hace(AHORA, AHORA)).toBe("hace un momento");
    expect(hace(AHORA - 59_000, AHORA)).toBe("hace un momento");
    expect(hace(AHORA + 30_000, AHORA)).toBe("hace un momento"); // reloj adelantado
  });
  test("minutos y horas", () => {
    expect(hace(AHORA - 4 * MIN, AHORA)).toBe("hace 4 min");
    expect(hace(AHORA - 59 * MIN, AHORA)).toBe("hace 59 min");
    expect(hace(AHORA - 2 * H, AHORA)).toBe("hace 2 h");
    expect(hace(AHORA - 14 * H - 30 * MIN, AHORA)).toBe("hace 14 h"); // 00:30 del mismo día
  });
  test("ayer y fecha (día calendario de Guatemala)", () => {
    expect(hace(AHORA - 16 * H, AHORA)).toBe("ayer"); // 7-nov 23:00
    expect(hace(AHORA - 30 * H, AHORA)).toBe("ayer"); // 7-nov 09:00
    expect(hace(AHORA - 3 * 24 * H, AHORA)).toMatch(/^5 nov/);
  });
  test("cerca de medianoche: menos de 6 h sigue en horas", () => {
    const madrugada = Date.UTC(2026, 10, 9, 7, 0, 0); // 9-nov 01:00 GT
    expect(hace(madrugada - 3 * H, madrugada)).toBe("hace 3 h"); // 8-nov 22:00
    expect(hace(madrugada - 7 * H, madrugada)).toBe("ayer");
  });
  test("corte por días", () => {
    expect(hace(AHORA - 3 * 24 * H, AHORA, { corte: "dias" })).toBe("hace 3 días");
    expect(hace(AHORA - 40 * 24 * H, AHORA, { corte: "dias" })).toMatch(/sept?|sep/);
  });
  test("otro año lleva el año; futuro lejano, la fecha", () => {
    expect(hace(Date.UTC(2025, 0, 15, 18), AHORA)).toMatch(/2025/);
    expect(hace(AHORA + 2 * 24 * H, AHORA)).toMatch(/^10 nov/);
    expect(hace(Number.NaN, AHORA)).toBe("—");
  });
});

describe("duracion", () => {
  test("cortes", () => {
    expect(duracion(0)).toBe("0 s");
    expect(duracion(45)).toBe("45 s");
    expect(duracion(60)).toBe("1 min");
    expect(duracion(82)).toBe("1 min 22 s");
    expect(duracion(3600)).toBe("1 h");
    expect(duracion(3700)).toBe("1 h 1 min");
    expect(duracion(200_000)).toBe("2 d 7 h");
    expect(duracion(-5)).toBe("0 s");
    expect(duracion(null)).toBe("—");
    expect(duracion(Number.POSITIVE_INFINITY)).toBe("—");
  });
});

describe("sinAcentos / normalizar", () => {
  test("quita tildes, diéresis y la tilde de la ñ", () => {
    expect(sinAcentos("Josué Peña Ñuñez")).toBe("Josue Pena Nunez");
    expect(sinAcentos("pingüino ÁÉÍÓÚ")).toBe("pinguino AEIOU");
    expect(sinAcentos("")).toBe("");
  });
  test("normalizar para buscar", () => {
    expect(normalizar("  María   JOSÉ ")).toBe("maria jose");
  });
});

describe("iniciales", () => {
  test("primer nombre + última palabra", () => {
    expect(iniciales("María José García López")).toBe("ML");
    expect(iniciales("josué garcía")).toBe("JG");
  });
  test("salta títulos y lo que no es letra", () => {
    expect(iniciales("Dra. Ana Pérez")).toBe("AP");
    expect(iniciales("Licda. Sofía")).toBe("SO");
    expect(iniciales("Desarrollo (correo)")).toBe("DE");
  });
  test("una palabra, vacío, una letra", () => {
    expect(iniciales("Gustavo")).toBe("GU");
    expect(iniciales("Gustavo Pérez", 1)).toBe("G");
    expect(iniciales("   ")).toBe("?");
    expect(iniciales("ñandú óscar")).toBe("ÑÓ");
  });
});
