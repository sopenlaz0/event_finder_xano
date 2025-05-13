export interface Event {
    id: number;
    name: string;
    utcStartDate: string; // timestamp
    duration: string;
    location_name: string;
    location_city: string;
    location_countryCode: string;
    organizedBy: string;
    usersGoing: number;
    usersInterested: number;
    url: string;
    imageUrl: string;
  }