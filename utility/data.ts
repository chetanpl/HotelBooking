import { Country, RoomOption } from "@/app/[locale]/form";

export const countries: Country[] = [
    { code: "+1", label: "United States", flag: "🇺🇸", flagUrl: "https://flagcdn.com/us.svg" },
    { code: "+91", label: "India", flag: "🇮🇳", flagUrl: "https://flagcdn.com/in.svg" },
    { code: "+81", label: "Japan", flag: "🇯🇵", flagUrl: "https://flagcdn.com/jp.svg" },
    { code: "+61", label: "Australia", flag: "🇦🇺", flagUrl: "https://flagcdn.com/au.svg" },
    { code: "+49", label: "Germany", flag: "🇩🇪", flagUrl: "https://flagcdn.com/de.svg" },
    { code: "+33", label: "France", flag: "🇫🇷", flagUrl: "https://flagcdn.com/fr.svg" },
    { code: "+86", label: "China", flag: "🇨🇳", flagUrl: "https://flagcdn.com/cn.svg" },
    { code: "+7", label: "Russia", flag: "🇷🇺", flagUrl: "https://flagcdn.com/ru.svg" },
    { code: "+39", label: "Italy", flag: "🇮🇹", flagUrl: "https://flagcdn.com/it.svg" },
    { code: "+34", label: "Spain", flag: "🇪🇸", flagUrl: "https://flagcdn.com/es.svg" },
    { code: "+44", label: "United Kingdom (the)", flag: "🇬🇧", flagUrl: "https://flagcdn.com/gb.svg" },
    { code: "+93", label: "Afghanistan", flag: "🇦🇫", flagUrl: "https://flagcdn.com/af.svg" },
    { code: "+355", label: "Albania", flag: "🇦🇱", flagUrl: "https://flagcdn.com/al.svg" },
    { code: "+213", label: "Algeria", flag: "🇩🇿", flagUrl: "https://flagcdn.com/dz.svg" },
    { code: "+684", label: "American Samoa", flag: "🇦🇸", flagUrl: "https://flagcdn.com/as.svg" },
  ];
  export const hotels = [
    "San Diego Marriott",
    "Sand Dunes Resort",
    "Sandy Shore Hotel",
    "San Francisco Inn",
    "Sea Breeze Hotel",
    "Sunset Bay Resort"
  ];
export const initialRoomOptions: RoomOption[] = [
  { type: "single", label: "Single Occupancy", subtitle: "1 adult" },
  { type: "double", label: "Double Occupancy", subtitle: "2 adults" },
  { type: "twin", label: "Twin", subtitle: "2 adults" }
];

export const familyOptions: RoomOption[] = [
  { type: "family2", label: "Family of 2", subtitle: "1 adult + 1 child" },
  { type: "family3_1", label: "Family of 3", subtitle: "2 adults + 1 child" },
  { type: "family3_2", label: "Family of 3", subtitle: "1 adult + 2 children" },
  { type: "family4", label: "Family of 4", subtitle: "2 adults + 2 children" }
];
export const extraRoom: RoomOption[] = [
  { type: "AccessibleSingle", label: "Accessible single occupancy", subtitle: "1 adult" },
  { type: "Accessibledouble", label: "Accessible double occupancy", subtitle: "2 adult" },
  { type: "Accessibletwin", label: "Accessible twin", subtitle: "2 adult" }
];