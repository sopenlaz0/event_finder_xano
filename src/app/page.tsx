"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Event } from "@/types/event";

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [category, setCategory] = useState("all");
  const [date, setDate] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const baseUrl = process.env.NEXT_PUBLIC_XANO_API_URL;
    const url = (category !== "all" || date)
      ? `${baseUrl}/events/filter?category=${category !== "all" ? category : ""}&date=${date}`
      : `${baseUrl}/events`;
    const res = await fetch(url);
    const data = await res.json();
    setEvents(Array.isArray(data) ? data : [data]);
  };

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEvents();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">ផ្នែកព្រឹត្តិការណ៍ភ្នំពេញ | Phnom Penh Events</h1>
      <form onSubmit={handleFilter} className="mb-6 flex flex-col sm:flex-row gap-4">
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Music">Music</SelectItem>
            <SelectItem value="Festival">Festival</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="text"
          placeholder="YYYY-MM or YYYY-MM-DD"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full sm:w-48"
        />
        <Button type="submit">Filter</Button>
      </form>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Link href={`/events/${event.id}`} key={event.id} className="block">
            <Card className="hover:shadow-lg transition-shadow h-full">
              <CardHeader>
                {event.imageUrl ? (
                  <img src={event.imageUrl} alt={event.name} className="w-full h-48 object-cover rounded-t-md" />
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded-t-md flex items-center justify-center">
                    <span className="text-gray-500">No image available</span>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg font-semibold">
                  {event.name}
                </CardTitle>
                <p className="text-sm text-gray-600">{new Date(event.utcStartDate).toLocaleString()}</p>
                <p className="text-sm text-gray-600">{[
                  event.location_name,
                  event.location_city
                ].filter(Boolean).join(', ') || 'Location not specified'}</p>
                <p className="text-sm text-gray-600">Organized by: {event.organizedBy || 'Not specified'}</p>
                <p className="text-sm text-gray-600">
                  {event.usersGoing} Going, {event.usersInterested} Interested
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}