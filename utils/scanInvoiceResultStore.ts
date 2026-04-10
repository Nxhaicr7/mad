import { ScanResult } from "@/types";

let pendingScanResult: ScanResult | null = null;

export const setPendingScanResult = (result: ScanResult) => {
  pendingScanResult = result;
};

export const consumePendingScanResult = (): ScanResult | null => {
  const result = pendingScanResult;
  pendingScanResult = null;
  return result;
};

