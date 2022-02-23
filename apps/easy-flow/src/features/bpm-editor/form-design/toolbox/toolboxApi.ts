import components from "@/config/components";
import { Schema } from "@type";

export function fetchComponents(): Promise<Schema> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(<Schema>components);
    }, 0);
  });
}
