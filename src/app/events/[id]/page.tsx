import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Event } from "@/types/event";
import Link from "next/link";
import Image from "next/image";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function EventDetails({ params }: PageProps) {
  const resolvedParams = await params;
  const baseUrl = process.env.NEXT_PUBLIC_XANO_API_URL;
  try {
    const res = await fetch(`${baseUrl}/events/${resolvedParams.id}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch event: ${res.status}`);
    }
    const event: Event = await res.json();
    console.log('Event data:', event); // Debug log

    if (!event) {
      throw new Error('Event not found');
    }

    return (
      <div className="container mx-auto p-4 min-h-screen bg-background">
        <Card className="bg-card">
          <CardHeader>
            {event.imageUrl ? (
              <div className="relative w-full max-w-md h-48 mx-auto">
                <Image
                  src={event.imageUrl}
                  alt={event.name}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
            ) : (
              <div className="w-full max-w-md h-48 bg-muted rounded-md mx-auto flex items-center justify-center">
                <span className="text-muted-foreground">No image available</span>
              </div>
            )}
            <CardTitle className="text-2xl font-bold text-card-foreground">{event.name}</CardTitle>
          </CardHeader>
          <CardContent className="text-card-foreground">
            <p><strong>Date:</strong> {new Date(event.utcStartDate).toLocaleString()}</p>
            {event.duration && <p><strong>Duration:</strong> {event.duration}</p>}
            <p><strong>Location:</strong> {[
              event.location_name,
              event.location_city,
              event.location_countryCode
            ].filter(Boolean).join(', ') || 'Not specified'}</p>
            <p><strong>Organized By:</strong> {event.organizedBy || 'Not specified'}</p>
            <p><strong>Attendance:</strong> {event.usersGoing} Going, {event.usersInterested} Interested</p>
            {event.url && (
              <Button asChild variant="link" className="text-primary">
                <a href={event.url} target="_blank" rel="noopener noreferrer">
                  View on Facebook
                </a>
              </Button>
            )}
            <Button asChild variant="link" className="ml-4 text-primary">
              <Link href="/">Back to Events</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  } catch (error) {
    console.error('Error fetching event:', error);
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent>
            <p className="text-red-500">Error loading event details. Please try again later.</p>
            <Button asChild variant="link" className="mt-4">
              <Link href="/">Back to Events</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
}