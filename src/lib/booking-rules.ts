import type { BookingStatus } from "./supabase";

export const SERVICE_TYPES = [
  "quickTrim",
  "fullResidential",
  "cleanUp",
  "other",
] as const;

export type ServiceType = (typeof SERVICE_TYPES)[number];

export type BookingInput = {
  name: string;
  phone: string;
  address: string;
  service: string;
  notes?: string | null;
  status?: BookingStatus;
};

export const SERVICE_LABELS: Record<ServiceType, string> = {
  quickTrim: "The Quick Trim",
  fullResidential: "Full Residential",
  cleanUp: "The Clean Up",
  other: "Other / Not Sure",
};

const STATUS_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  pending: ["confirmed"],
  confirmed: ["pending", "completed"],
  completed: ["confirmed"],
};

export function isValidServiceType(value: string): value is ServiceType {
  return SERVICE_TYPES.includes(value as ServiceType);
}

export function getServiceLabel(service: string): string {
  return isValidServiceType(service) ? SERVICE_LABELS[service] : service;
}

export function validateBookingInput(input: BookingInput): string[] {
  const errors: string[] = [];
  const trimmedName = input.name.trim();
  const trimmedPhone = input.phone.trim();
  const trimmedAddress = input.address.trim();

  if (trimmedName.length < 2) {
    errors.push("Customer name must be at least 2 characters.");
  }

  if (trimmedPhone.replace(/\D/g, "").length < 8) {
    errors.push("Phone number must include at least 8 digits.");
  }

  if (trimmedAddress.length < 6) {
    errors.push("Property address must be at least 6 characters.");
  }

  if (!isValidServiceType(input.service)) {
    errors.push("Please select a valid service.");
  }

  if (input.status && !["pending", "confirmed", "completed"].includes(input.status)) {
    errors.push("Booking status is invalid.");
  }

  return errors;
}

export function canTransitionBookingStatus(
  currentStatus: BookingStatus,
  nextStatus: BookingStatus
): boolean {
  if (currentStatus === nextStatus) {
    return true;
  }

  return STATUS_TRANSITIONS[currentStatus].includes(nextStatus);
}

export function getAllowedStatusTransitions(currentStatus: BookingStatus): BookingStatus[] {
  return STATUS_TRANSITIONS[currentStatus];
}

export function canDeleteBooking(status: BookingStatus): boolean {
  return status !== "completed";
}
