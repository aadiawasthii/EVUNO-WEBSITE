import "server-only";

const DEFAULT_SAN_DIEGO_POSTAL_CODES = [
  "92014",
  "92037",
  "92038",
  "92067",
  "92093",
  "92101",
  "92102",
  "92103",
  "92104",
  "92105",
  "92106",
  "92107",
  "92108",
  "92109",
  "92110",
  "92111",
  "92113",
  "92114",
  "92115",
  "92116",
  "92117",
  "92119",
  "92120",
  "92121",
  "92122",
  "92123",
  "92124",
  "92126",
  "92127",
  "92128",
  "92129",
  "92130",
  "92131",
  "92132",
  "92134",
  "92139",
  "92145",
  "92154",
  "92173"
] as const;

function parsePostalConfig(rawValue: string | undefined) {
  if (!rawValue) {
    return [];
  }

  return rawValue
    .split(",")
    .map((value) => value.trim().toUpperCase().replace(/[^A-Z0-9]/g, ""))
    .filter(Boolean);
}

function readSanDiegoPostalCodes() {
  const codes = parsePostalConfig(process.env.STRIPE_SAN_DIEGO_FREE_SHIPPING_POSTAL_CODES);

  return codes.length ? codes : [...DEFAULT_SAN_DIEGO_POSTAL_CODES];
}

function readLegacySanDiegoPostalPrefixes() {
  const prefixes = parsePostalConfig(process.env.STRIPE_SAN_DIEGO_FREE_SHIPPING_POSTAL_PREFIXES);

  return prefixes;
}

export function normalizePostalCode(postalCode: string) {
  return postalCode.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function isSanDiegoFreeShippingPostalCode(postalCode: string) {
  const normalized = normalizePostalCode(postalCode);

  if (!normalized) {
    return false;
  }

  if (readSanDiegoPostalCodes().includes(normalized)) {
    return true;
  }

  return readLegacySanDiegoPostalPrefixes().some((prefix) => normalized.startsWith(prefix));
}
