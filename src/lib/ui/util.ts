function pad0(number: number | string, len: number): string {
  let output = String(number);
  while (output.length < len) {
    output = "0" + output;
  }
  return output;
}

export function formatDate(a?: string | Date) {
  let d: Date;
  if (!a) {
    d = new Date();
  } else if (typeof a === "string") {
    d = new Date(a);
  } else {
    d = a;
  }
  const YY = d.getFullYear() % 100;
  const MM = pad0(d.getMonth() + 1, 2);
  const dd = pad0(d.getDate(), 2);
  const HH = pad0(d.getHours(), 2);
  const mm = pad0(d.getMinutes(), 2);
  const ss = pad0(d.getSeconds(), 2);
  return `${YY}-${MM}-${dd} ${HH}:${mm}:${ss}`;
}
