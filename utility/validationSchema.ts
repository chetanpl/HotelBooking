import { z } from "zod";

export const contactDetailsSchema = z.object({
   title: z.string().refine((val) => val !== "", {
  message: "Please select your title.",
}),
  firstName: z.string().min(1, "Please enter your first name.").max(20, "Max 20 characters"),
  lastName: z.string().min(1, "Please enter your last name.").max(30, "Max 30 characters"),
  phoneNumber: z.string().min(1, "Please enter your phone number.").regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number."),
   email: z.string().email("Please enter a valid email address."),
});
export const bookingSchema = z.object({
  bookerType: z.string().min(1, "Please select a booker type"),
  companyname:z.string().min(1, "Please enter Company name.").max(20, "Max 20 characters"),
  stayType: z.string().min(1, "Please select a stay type"),
  schoolGroup: z.boolean(),
  groupVisitReason: z.string().min(1, "Please select a reason for visit"),
  checkIn: z.date({
  required_error: "Check-in date is required",
}),
  checkOut: z.date({
  required_error: "Check-out date is required",
}),
  packageType: z.string().min(1, "Please select a package type"),
});

export const numberOfRooms = z.object({
  room: z.string().min(10, "Please enter your first name.").max(20, "Max 20 characters")
});
export const combinedSchema = z.object({
  contact: contactDetailsSchema,
  booking: bookingSchema,
  numberofroom:numberOfRooms
});
export type ContactDetailsFormValues = z.infer<typeof combinedSchema>;