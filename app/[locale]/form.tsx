"use client";
type RadioCardGroupProps = {
  name: string;
  options: string[];
  selected: string;
  onChange: (value: string) => void;
};

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import Header from "../components/header";
import { AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import 'flatpickr/dist/themes/material_blue.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import Image from "next/image";
import { useTranslations } from "next-intl";
import RoomSelector from "../components/roomstype";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactDetailsSchema, ContactDetailsFormValues, combinedSchema } from "./../../utility/validationSchema";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { countries, extraRoom, familyOptions, hotels, initialRoomOptions } from "@/utility/data";
export type RoomType = "single" | "double" | "twin" | "family2" | "family3_1" | "family3_2" | "family4" | "AccessibleSingle" | "Accessibledouble" | "Accessibletwin"
interface Rooms {
  single: number;
  double: number;
  twin: number;
}
export interface Country {
  code: string;
  label: string;
  flag: string;
  flagUrl: string;
}

export type RoomOption = {
  type: RoomType;
  label: string;
  subtitle: string;
};

function Accordion({ title,
  children,
  isOpen,
  onToggle,
}: {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}) {

  return (
    <div className="border rounded mb-4 shadow-sm">
      <button
        type="button"
        className="w-full font-semibold bg-white-100 p-4 flex justify-between items-center text-[#717377] border-b text-sm sm:text-base"
        onClick={onToggle} aria-expanded={isOpen} aria-label={`${title}, ${isOpen ? 'expanded' : 'collapsed'}`} id="collapsible-button"

      >
        {title}
        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>
      {isOpen && <div className="p-4 text-sm text-gray-600" id="collapsible-content" aria-labelledby="collapsible-button">{children}</div>}
    </div>
  );
}
const RadioCardGroup = ({ name, options, selected, onChange }: RadioCardGroupProps) => (
  <div className="space-y-2" role="radiogroup"
    aria-labelledby={`${name}-label`} >
    {options.map((opt) => {
      const isSelected = selected === opt;
      return (
        <label
          key={opt}
          className={`block border rounded px-4 py-3 cursor-pointer text-sm ${isSelected
            ? 'border-cyan-700 bg-cyan-50'
            : 'border-gray-300 hover:border-gray-400'
            }`} aria-checked={isSelected}
          role="radio"
          tabIndex={isSelected ? 0 : -1}
          onKeyDown={(e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              e.preventDefault();
              onChange(opt);
            }
          }}
        >
          <input
            type="radio"
            name={name}
            value={opt}
            checked={isSelected}
            onChange={() => onChange(opt)}
            className="sr-only"
            aria-labelledby={`${name}-option-${opt}`}
          />
          <div className="flex items-center justify-between">
            <span className="text-gray-900">{opt}</span>
            {isSelected && (
              <span className="w-4 h-4 rounded-full border-2 border-cyan-700 bg-cyan-700" aria-hidden="true" />
            )}
          </div>
        </label>
      );
    })}
  </div>
);

// type ContactDetails = z.infer<typeof contactDetailsSchema>;
export default function Form({ data }: { data: any }) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [bookerType, setBookerType] = useState<string>('');
  const [stayType, setStayType] = useState<string>('');
  const [packageType, setPackageType] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [schoolGroup, setSchoolGroup] = useState<boolean>(false);
  const [reasonError, setReasonError] = useState<boolean>(false);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState<boolean>(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>({ code: "+44", label: "United Kingdom (the)", flag: "🇬🇧", flagUrl: "https://flagcdn.com/gb.svg" });
  const [phoneInputValue, setPhoneInputValue] = useState<string>("");
  const [countrySearch, setCountrySearch] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [selectedHotel, setSelectedHotel] = useState<string>('');
  const [hotelSuggestions, setHotelSuggestions] = useState<string[]>([]);
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [visitReason, setVisitReason] = useState<string>('');
  const [visitReasonError, setVisitReasonError] = useState<boolean>(false);
  const [activeField, setActiveField] = useState<'checkin' | 'checkout' | null>(null);
  const [withChildren, setWithChildren] = useState<boolean>(false);
  const [extraRoomNeeded, setExtraRoomNeeded] = useState<boolean>(false);
  const [roomOptions, setRoomOptions] = useState<RoomOption[]>(initialRoomOptions);
  const [rooms, setRooms] = useState<Record<RoomType, number>>(() => {
    return Object.fromEntries(
      initialRoomOptions.map(({ type }) => [type, 0])
    ) as Record<RoomType, number>;
  });

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    trigger,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<ContactDetailsFormValues>({
    resolver: zodResolver(combinedSchema),
    defaultValues: {
      contact: {
        title: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
      },
      booking: {
        bookerType: "",
        stayType: "",
        schoolGroup: false,
        groupVisitReason: "",
        checkIn: undefined,
        checkOut: undefined,
        packageType: "",
      },
      numberofroom: { room: { 'totalRooms': 0 },comments:"" }
    },
  });


  const onSubmit = async (data: ContactDetailsFormValues
  ) => {
    const contact = data.contact;
    const booking = data.booking;
    const totalRoom = data.numberofroom?.room?.total;
    const anyComments= data.numberofroom?.room;
const payload = {
    contact: data.contact,
    booking: data.booking,
    numberofroom: {
      room: data.numberofroom?.room,
      comments: data.numberofroom?.comments || '',
    },
  };
  try {
    const apiUrl:string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/booking';
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Validation error:', errorData.error);
    } else {
      const result = await response.json();
      alert(result.message);
      window.location.reload();
    }
  } catch (error) {
    console.error('Submission failed:', error);
  }
    // handle the full form data
  };

  const t = useTranslations('Booking');
  useEffect(() => {
    if (countryDropdownOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [countryDropdownOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCountryDropdownOpen(false);
        setCountrySearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  useEffect(() => {
    if (checkIn) {
      setValue("booking.checkIn", new Date(checkIn));
      clearErrors("booking.checkIn");
    }
  }, [checkIn]);

  useEffect(() => {
    if (checkOut) {
      setValue("booking.checkOut",  new Date(checkOut));
      clearErrors("booking.checkOut");
    }
  }, [checkOut]);

  const toggleDropdown = (): void => setCountryDropdownOpen(!countryDropdownOpen);
  const handleSelect = (country: Country): void => {
    setSelectedCountry(country);
    setCountryDropdownOpen(false);
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const numericOnly = e.target.value.replace(/[^\d]/g, "");
    setPhoneInputValue(numericOnly);
    setPhoneInputValue(numericOnly);

  };

  const handleHotelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSelectedHotel(query);

    if (query) {
      const matches = hotels.filter(hotel =>
        hotel.toLowerCase().includes(query.toLowerCase())
      );
      setHotelSuggestions(matches);
    } else {
      setHotelSuggestions([]);
    }
  };

  const handleHotelSelect = (hotelName: string) => {
    setSelectedHotel(hotelName);
    setHotelSuggestions([]);
  };

  const handleChildrenToggle = (e: ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setWithChildren(checked);
    if (checked && !extraRoomNeeded)
      setRoomOptions([...initialRoomOptions, ...familyOptions]);
    else if (!checked && extraRoomNeeded)
      setRoomOptions([...initialRoomOptions, ...extraRoom]);
    else if (checked && extraRoomNeeded)
      setRoomOptions([...initialRoomOptions, ...familyOptions, ...extraRoom]);
    else
      setRoomOptions([...initialRoomOptions]);

  };

  const handleAccessibleRoomtoggle = (e: ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setExtraRoomNeeded(checked);
    if (checked && !withChildren)
      setRoomOptions([...initialRoomOptions, ...extraRoom]);
    else if (!checked && withChildren)
      setRoomOptions([...initialRoomOptions, ...familyOptions]);
    else if (checked && withChildren) {
      setRoomOptions([...initialRoomOptions, ...familyOptions, ...extraRoom]);
    } else {
      setRoomOptions([...initialRoomOptions]);
    }
  };


  const handleContinue = async () => {
    const isValidContact = await trigger('contact');

    if (isValidContact) {
      setActiveIndex(1)
    }

  };

  const continueBooking = async () => {
    const isSectionValid = await trigger([
      'booking.bookerType',
      'booking.stayType',
      'booking.groupVisitReason',
      'booking.packageType',
    ]);

    let isDateValid = true;

    // Validate Check-in date
    if (!checkIn) {
      setError('booking.checkIn', {
        type: 'manual',
        message: 'Check-in date is required',
      });
      isDateValid = false;
    } else {
      clearErrors('booking.checkIn');
      setValue('booking.checkIn', checkIn);
    }

    // Validate Check-out date
    if (!checkOut) {
      setError('booking.checkOut', {
        type: 'manual',
        message: 'Check-out date is required',
      });
      isDateValid = false;
    } else {
      clearErrors('booking.checkOut');
      setValue('booking.checkOut', checkOut);
    }
    // If both sections (form + date) are valid, proceed
    if (isSectionValid && isDateValid) {
      setActiveIndex(2); // or any index for the next section
    }
    // Proceed with form submission
  };
  useEffect(() => {
    const totalRooms = Object.values(rooms).reduce((sum, count) => sum + count, 0);
    setValue("numberofroom.room", { total: totalRooms });
  }, [rooms])

  return (
    <>
      <Header />
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <main role="main" aria-labelledby="group-booking-title">
          <h1 className="text-xl sm:text-2xl font-semibold mb-2">{t('formName')}</h1>
          <p className="text-sm sm:text-base text-gray-600 my-6">
            <strong>{t('formDescription1')}</strong> {' '}
          </p>

          {/* Contact details (always open) */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Accordion title={t('contactDetails')} isOpen={activeIndex === 0} onToggle={() => setActiveIndex(0)}>
              <h2 className="text-lg font-semibold mb-6 text-[#333]">{t('accordianContactDetails')} </h2>
              <div className="mb-4 relative max-w-[200px]">
                <label htmlFor="title" id="contact-details-title" className="block text-sm font-medium text-gray-900 absolute left-[20%] transform -translate-x-1/2 top-[-22%] z-10 bg-white px-2">
                  {t('titleLabel')}
                </label>
                <select
                  {...register("contact.title")}
                  id="title"
                  name="title"
                  aria-required="true"
                  aria-labelledby="contact-details-title"
                  className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onChange={(e) => {
                    setValue("contact.title", e.target.value); // Manually update the value
                    console.log(getValues("contact.title")); // Log the updated value
                  }}
                >
                  <option value="" disabled></option>
                  <option value="mr">Mr</option>
                  <option value="ms">Ms</option>
                  <option value="mrs">Mrs</option>
                  <option value="dr">Mx</option>
                  <option value="dr">Master</option>
                  <option value="dr">Dr</option>
                  <option value="dr">Lord</option>
                  <option value="dr">Lady</option>
                  <option value="dr">Sir</option>
                  <option value="dr">Col</option>
                </select>

                {errors.contact?.title && (
                  <p className="text-red-600">{t('error_title')}</p>
                )}
              </div>
              {/* First Name */}
              <div className="mb-4 relative">
                <input {...register("contact.firstName")}
                  id="FirstName"
                  type="text"
                  placeholder={t('firstName')} aria-required="true"
                  aria-describedby="firstName-desc"
                  className="peer w-full border border-gray-300 rounded px-4 py-3 text-sm text-[#333]"
                />
                <label
                  htmlFor="FirstName"
                  className="block text-sm font-medium text-gray-900 absolute left-[2%] top-[-22%] z-10 bg-white px-2 opacity-0 peer-focus:opacity-100 transition-opacity duration-200"
                >
                  {t('firstName')}
                </label>
                {errors.contact?.firstName?.message && (
                  <p className="text-red-600">{t('error_firstname')}</p>
                )}
              </div>

              {/* Last Name */}
              <div className="mb-4 relative">
                <input  {...register("contact.lastName")}
                  id="LastName"
                  type="text"
                  placeholder={t('lastName')} aria-required="true"
                  aria-describedby="lastName-desc"
                  className="peer w-full border border-gray-300 rounded px-4 py-3 text-sm text-[#333]"
                />
                <label
                  htmlFor="LastName"
                  className="block text-sm font-medium text-gray-900 absolute left-[2%] top-[-22%] z-10 bg-white px-2 opacity-0 peer-focus:opacity-100 transition-opacity duration-200"
                >
                  {t('lastName')}
                </label>
                {errors.contact?.lastName?.message && (
                  <p className="text-red-600">{t('error_lastname')}</p>
                )}
              </div>


              <div className="mb-4 relative" ref={dropdownRef}>
                <div className="flex border border-gray-300 rounded px-4 py-3 text-sm focus-within:ring-2 focus-within:ring-blue-500">
                  <button
                    type="button"
                    onClick={toggleDropdown}
                    className="flex items-center pr-2 focus:outline-none"
                    aria-expanded={countryDropdownOpen}
                    aria-haspopup="listbox"
                    aria-label="Select country code"
                  >
                    <span className="mr-2 flex items-center gap-1">
                      <Image
                        src={selectedCountry.flagUrl}
                        alt={selectedCountry.label + ' flag'}
                        className="w-5 h-4 rounded-sm"
                        width={600}
                        height={400}
                        aria-describedby="image-desc"
                        aria-hidden="true"
                      />
                      {selectedCountry.code}
                    </span>
                    {countryDropdownOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  <div className="relative w-full">
                    <input  {...register("contact.phoneNumber")}
                      type="tel"
                      id="PhoneNumber"
                      placeholder={t('phone')}
                      value={phoneInputValue}
                      onChange={handlePhoneChange}
                      className="peer w-full outline-none text-[#333] bg-transparent"
                      aria-describedby="phone-desc"
                      aria-required="true"
                    />
                    <label
                      htmlFor="PhoneNumber" style={{ transform: 'translateY(-120%)' }}
                      className="absolute left-[-20%] top-0 text-sm font-medium text-gray-900 bg-white px-1 transition-opacity duration-200 opacity-0 peer-focus:opacity-100 peer-placeholder-shown:opacity-0"
                    >
                      {t('phone')} *
                    </label>
                  </div>
                </div>
                {errors.contact?.phoneNumber?.message && (
                  <p className="text-red-600">{t('error_phonenumber')}</p>
                )}
                <p id="phone-desc" className="sr-only">
                  Enter a valid phone number including area code.
                </p>

                {countryDropdownOpen && (
                  <ul
                    role="listbox"
                    className="absolute z-10 mt-1 w-full max-h-60 overflow-auto border border-gray-300 bg-white rounded shadow-md text-sm"
                  >
                    <li className="sticky top-0 bg-white px-2 py-1">
                      <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search..."
                        className="w-full px-2 py-1 border border-gray-300 rounded"
                        value={countrySearch}
                        onChange={(e) => setCountrySearch(e.target.value)}
                        aria-label="Search countries"

                      />
                    </li>
                    {countries
                      .filter(
                        (c) =>
                          c.label.toLowerCase().includes(countrySearch.toLowerCase()) ||
                          c.code.includes(countrySearch)
                      )
                      .map((c: Country, index: number) => (
                        <li
                          key={index}
                          role="option"
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                          onClick={() => handleSelect(c)}
                          tabIndex={0}
                          aria-selected={c.code === selectedCountry.code}
                        >
                          <img
                            src={c.flagUrl}
                            alt={c.label + ' flag'}
                            className="w-5 h-4 rounded-sm"
                            aria-hidden="true"
                          />{' '}
                          {c.code} {c.label}
                        </li>
                      ))}
                  </ul>
                )}
              </div>

              {/* Email */}
              <div className="mb-6 relative">
                <input {...register("contact.email")}
                  id="Email"
                  type="email"
                  placeholder={t('email')}
                  className="peer w-full border border-gray-300 rounded px-4 py-3 text-sm text-[#333]"
                  aria-required="true"
                  aria-describedby="email-desc"
                />
                <label
                  htmlFor="Email"
                  className="block text-sm font-medium text-gray-900 absolute left-[2%] top-[-22%] z-10 bg-white px-2 opacity-0 peer-focus:opacity-100 transition-opacity duration-200"
                >
                  {t('email')} *
                </label>
                {errors.contact?.email?.message && (
                  <p className="text-red-600">{errors.contact.email.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button type="button" id='continueBooking1' aria-label="Continue to next step" onClick={handleContinue} className="w-full bg-[#007f8f] text-white font-semibold py-3 rounded hover:bg-[#006e7c] transition">
                Continue
              </button>
            </Accordion>





            {/* Booking details */}
            <Accordion title={t('bookingDetails')} isOpen={activeIndex === 1}
              onToggle={() => setActiveIndex(1)}>
              <div className="space-y-6">
                <div className="max-w-md space-y-6 text-sm text-gray-800" aria-labelledby="booking-details-heading">
                  <h3 className="font-medium mb-2 sr-only">What type of booker are you?</h3>
                  <RadioCardGroup
                    name="bookerType"
                    options={['Personal', 'Business', 'Travel Management Company', 'Travel Agent/Tour Operator']}
                    selected={bookerType}
                    onChange={(value) => {
                      setBookerType(value);
                      setValue('booking.bookerType', value);
                      trigger('booking.bookerType');
                    }}
                    aria-required="true"
                  />
                  {errors.booking?.bookerType && (
                    <p className="text-sm text-red-600">{errors.booking.bookerType.message}</p>
                  )}
                </div>







                <div className="mb-4 relative">
                  <input {...register("booking.companyname")}
                    id="CompanyName"
                    type="text"
                    placeholder="Company Name *" aria-required="true"
                    aria-describedby="company-desc"
                    className="peer w-full border border-gray-300 rounded px-4 py-3 text-sm text-[#333]"
                  />
                  <label
                    htmlFor="CompanyName"
                    className="block text-sm font-medium text-gray-900 absolute left-[2%] top-[-22%] z-10 bg-white px-2 opacity-0 peer-focus:opacity-100 transition-opacity duration-200"
                  >
                    Company Name *
                  </label>
                  {errors.booking?.companyname?.message && (
                    <p className="text-sm text-red-600 mt-1">{errors.booking.companyname.message}</p>
                  )}
                </div>
                <>
                  <h3 className="font-medium mb-2">Is your group staying for Business or Leisure?</h3>
                  <RadioCardGroup
                    name="stayType"
                    options={['Business', 'Leisure']}
                    selected={stayType}
                    onChange={(value) => {
                      setStayType(value);
                      setValue('booking.stayType', value);
                      trigger('booking.stayType');
                    }}
                    aria-required="true"
                  />
                  {errors.booking?.stayType && (
                    <p className="text-sm text-red-600 mt-1">{errors.booking.stayType.message}</p>
                  )}
                </>

                <label className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={schoolGroup}
                    onChange={(e) => setSchoolGroup(e.target.checked)}
                    className="mt-1"
                  />
                  <span>Please tick this box if you are booking for a school or youth group.</span>
                </label>

                <>
                  <label htmlFor="groupVisitReason" className="block font-medium mb-1">What is the reason for your group's visit?</label>
                  <select
                    className={`w-full border rounded px-3 py-2 text-sm ${reasonError ? 'border-red-500' : 'border-gray-300'}`}
                    value={reason}
                    onChange={(e) => {
                      const value = e.target.value;
                      setReason(value);
                      setValue('booking.groupVisitReason', value);
                      trigger('booking.groupVisitReason');
                    }}
                    aria-invalid={reasonError ? "true" : "false"}
                    aria-required="true" >
                    <option value="">Select a reason</option>
                    {[
                      "Religious/Church event",
                      "School group",
                      "Sport event",
                      "Sport team - Adult",
                      "Sport team - Youth",
                      "Stag/Hen party",
                      "Trade fair",
                      "Wedding",
                      "Work crew",
                      "Youth group"
                    ].map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  {errors.booking?.groupVisitReason && (
                    <p className="text-sm text-red-600 mt-1">{errors.booking.groupVisitReason.message}</p>
                  )}
                </>
                <>
                  <label className="block font-medium mb-1">Booking details</label>
                  <label className="flex items-start gap-2">
                    <span>Our team will try to accommodate your group’s preferences in terms of hotels and dates. If that’s not possible, we’ll do everything we can to offer the best alternatives.</span>
                  </label>
                </>

                <div className="relative max-w-md w-full">
                  {/* Calendar Icon */}
                  <div className="absolute left-3 top-3 text-gray-500">
                    <CalendarDaysIcon className="w-5 h-5" />
                  </div>

                  <div aria-label="Booking dates" className={`flex justify-between items-center rounded px-10 py-2 text-sm bg-white shadow-sm cursor-pointer select-none ${errors.booking?.checkIn || errors.booking?.checkOut ? 'border border-red-500' : 'border border-gray-300'
                    }`}>
                    <div aria-pressed={activeField === 'checkin'}
                      tabIndex={0}
                      role="button" aria-describedby="checkInDesc"
                      className="flex-1"
                      onClick={() => setActiveField('checkin')}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setActiveField('checkin');
                        }
                      }}
                    >
                      <p className="text-gray-500 text-xs">Check In</p>
                      <p className="text-black">
                        {checkIn ? checkIn.toLocaleDateString() : 'Select date'}
                      </p>
                      {errors.booking?.checkIn && (
                        <p className="text-sm text-red-600 mt-1">{errors.booking?.checkIn.message}</p>
                      )}
                    </div>

                    {/* Divider */}
                    <div className="w-px h-8 bg-gray-300 mx-2" />

                    {/* Right side: Check Out */}
                    <div
                      className="flex-1 text-right" role="button"
                      aria-pressed={activeField === 'checkout'} aria-describedby="checkOutDesc"
                      onClick={() => setActiveField('checkout')}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setActiveField('checkout');
                        }
                      }}
                    >
                      <p className="text-gray-500 text-xs">Check Out</p>
                      <p className="text-black">
                        {checkOut ? checkOut.toLocaleDateString() : 'Select date'}
                      </p>
                      {errors.booking?.checkOut && (
                        <p className="text-sm text-red-600 mt-1">{errors.booking?.checkOut.message}</p>
                      )}
                    </div>
                  </div>




                  {/* Actual DatePicker, rendered once and reused for both fields */}
                  {activeField && (
                    <div className="absolute z-50 mt-2" role="dialog" aria-modal="true" aria-label="Select booking date">
                      <DatePicker
                        selected={activeField === 'checkin' ? checkIn : checkOut}
                        onChange={(date: Date | null) => {
                          if (activeField === 'checkin') {
                            setCheckIn(date);
                            if (checkOut && date && date > checkOut) {
                              setCheckOut(null); // reset if check-in is after check-out
                            }
                          } else {
                            setCheckOut(date);
                          }
                          setActiveField(null); // close picker after selecting
                        }}
                        inline
                        minDate={
                          activeField === 'checkout' && checkIn ? checkIn : new Date()}
                      />
                    </div>
                  )}
                </div>
                <>
                  <h3 className="font-medium mb-2">Package type</h3>
                  <RadioCardGroup
                    name="packageType"
                    options={['Premier Inn Breakfast', 'Meal deal (dinner, drink and breakfast)']}
                    selected={packageType}
                    onChange={(value) => {
                      setPackageType(value);
                      setValue('booking.packageType', value);
                      trigger('booking.packageType');
                    }}
                    aria-required="true"
                  />
                </>
                {errors.booking?.packageType && (
                  <p className="text-sm text-red-600 mt-1">{errors.booking.packageType.message}</p>
                )}
                <>   <button type="button" id='continueBooking2' onClick={continueBooking} aria-label="Continue to next step" className="w-full bg-[#007f8f] text-white font-semibold py-3 rounded hover:bg-[#006e7c] transition">
                  Continue
                </button></>
              </div>


            </Accordion>

            {/* Room requirements */}
            <Accordion title={t('room_requirment')} isOpen={activeIndex === 2}
              onToggle={() => setActiveIndex(2)} aria-expanded={activeIndex === 2}
              aria-controls="room-requirements-panel" aria-labelledby="room-requirements-header">

              <>
                <h3 className="text-xl font-semibold">Rooms</h3>
                <p id="room-selection-desc" className="text-sm text-gray-600 my-2">
                  Select the maximum number of rooms required by room type and occupancy.
                </p>
                <p className="text-sm text-blue-600 underline mb-2">
                  <a aria-describedby="room-selection-desc"
                    href="https://www.premierinn.com/gb/en/sleep/our-rooms.html"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    See room types
                  </a>
                </p>

                <div className="flex items-center gap-2 my-3">
                  <input
                    type="checkbox"
                    id="with-children"
                    checked={withChildren}
                    onChange={handleChildrenToggle}
                    className="w-4 h-4" aria-describedby="with-children-description"
                  />
                  <label htmlFor="with-children" className="text-sm">
                    Travelling/staying with children (2-15 years).
                  </label>
                </div>

                <div className="flex items-center gap-2 my-3">
                  <input
                    type="checkbox"
                    id="accessible-room"
                    checked={extraRoomNeeded}
                    onChange={handleAccessibleRoomtoggle}
                    className="w-4 h-4"
                    aria-describedby="accessible-room-desc"
                  />
                  <label htmlFor="accessible-room" className="text-sm">
                    Accessible room is needed.
                  </label>
                </div>
                {withChildren &&
                  <div role="alert"
                    aria-live="polite"
                    className="border border-orange-300 bg-orange-50 text-orange-800 rounded px-4 py-3 flex gap-3 items-start text-sm mb-6">
                    <AlertTriangle className="w-5 h-5 mt-1 text-orange-500" aria-hidden="true"
                      focusable="false" />
                    <div>
                      <p>
                        At least one adult (18+) must be in every room with a child under 16 years.
                      </p>
                      <a target="_blank"
                        href="https://www.premierinn.com/gb/en/terms/booking-terms-and-conditions.html"
                        className="underline text-purple-700 hover:text-purple-800 focus:outline-none focus:ring focus:ring-purple-300"
                        aria-describedby="children-occupancy-info" >
                        Read occupancy policy
                      </a>
                    </div>
                  </div>
                }

                {errors.numberofroom?.message && (
                  <div
                    role="alert"
                    aria-live="polite"
                    className="border border-red-500 bg-pink-100 text-red-800 rounded px-4 py-3 flex gap-3 items-start text-sm mb-6"
                  >
                    <AlertTriangle
                      className="w-10 h-5 mt-0.5 text-red-500"
                      aria-hidden="true"
                      focusable="false"
                    />
                    <div>
                      <p id="group-booking-info">
                        Group bookings require a minimum of 10 rooms. For a group booking of 6 to 9 rooms, call us on 0333 003 8101. For a group booking of up to 5 rooms, visit our website.
                      </p>
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://www.premierinn.com/gb/en/home.html"
                        className="underline text-purple-700 hover:text-purple-800 focus:outline-none focus:ring focus:ring-purple-300"
                        aria-describedby="group-booking-info"
                      >
                        Read occupancy policy
                      </a>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <RoomSelector options={roomOptions} rooms={rooms} setRooms={setRooms} />
                </div>

                <section aria-labelledby="additional-info-heading" className="mt-6">
                  <h3 id="additional-info-heading" className="text-xl font-semibold">
                    Additional information (optional)
                  </h3>
                  <p className="text-sm text-gray-600 my-2">
                    Let us know if you have any additional information or special requests.
                  </p>
                  <p className="text-sm text-gray-600">
                    If you do not require the same number of rooms on each night of your stay,
                    please state below the number and type of rooms required each night.
                  </p>
                </section>

                <textarea
                  name="comments"
                  id="comments"
                  placeholder="Enter your comments here"
                  maxLength={1000}
                  onChange={(e)=> setValue("numberofroom.comments", e.target?.value)}
                  className="w-full mt-2 p-2 border rounded resize-none h-24"
                />

                <button type="submit" id='finalbutton' aria-label="Continue to next step" className="w-full bg-[#007f8f] text-white font-semibold py-3 rounded hover:bg-[#006e7c] transition">
                  Submit Request
                </button>
              </>
            </Accordion>
          </form>
          {/* Cancel */}
          <div className="mt-6">
            <button type="button" className="text-sm text-blue-600 hover:underline" onClick={() => {
              window.location.href = "https://www.premierinn.com/gb/en/home.html";
            }}>← Cancel and return to home</button>
          </div>
        </main>
      </div>
    </>
  );
}
