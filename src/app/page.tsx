"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { Event } from "@/types/event";

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [category, setCategory] = useState("all");
  const [date, setDate] = useState("");

  const fetchEvents = async () => {
    const baseUrl = process.env.NEXT_PUBLIC_XANO_API_URL;
    const url = (category !== "all" || date)
      ? `${baseUrl}/events/filter?category=${category !== "all" ? category : ""}&date=${date}`
      : `${baseUrl}/events`;
    const res = await fetch(url);
    const data = await res.json();
    setEvents(Array.isArray(data) ? data : [data]);
  };

  useEffect(() => {
    fetchEvents();
  }, [category, date]);

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEvents();
  };

  return (
    <div className="container mx-auto p-4 min-h-screen bg-background">
      <h1 className="text-2xl font-bold mb-4 text-foreground">ផ្នែកព្រឹត្តិការណ៍ភ្នំពេញ | Phnom Penh Events</h1>
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
            <Card className="hover:shadow-lg transition-shadow h-full bg-card">
              <CardHeader>
                {event.imageUrl ? (
                  <div className="relative w-full h-48">
                    <Image
                      src={event.imageUrl}
                      alt={event.name}
                      fill
                      className="object-cover rounded-t-md"
                    />
                  </div>
                ) : (
                  <div className="w-full h-48 bg-muted rounded-t-md flex items-center justify-center">
                    <span className="text-muted-foreground">No image available</span>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg font-semibold text-card-foreground">
                  {event.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{new Date(event.utcStartDate).toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">{[
                  event.location_name,
                  event.location_city
                ].filter(Boolean).join(', ') || 'Location not specified'}</p>
                <p className="text-sm text-muted-foreground">Organized by: {event.organizedBy || 'Not specified'}</p>
                <p className="text-sm text-muted-foreground">
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