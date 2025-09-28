import { useEffect, useState } from "react";
import Link from "next/link";
import { Event } from "@/types/event";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
} from "@mui/material";

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => setEvents(data));
  }, []);

 const sortedEvents = events
  .filter((ev) => ev.title.toLowerCase().includes(query.toLowerCase()))
  .sort((a, b) => {
    // Sort by title length
    const lenDiff = a.title.length - b.title.length;
    if (lenDiff !== 0) return lenDiff;

    // Sort by date
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateA - dateB; 
  });

  return (
    <main style={{ maxWidth: 800, margin: "2rem auto" }}>
      <h1 style={{ marginBottom: "1rem" }}>Upcoming Events</h1>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
        <TextField
          label="Search by title"
          variant="outlined"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          fullWidth
        />
        <Link href="/create" passHref>
          <Button variant="contained" color="primary">
            Create Event
          </Button>
        </Link>
      </div>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedEvents.map((ev) => (
              <TableRow key={ev.id} hover>
                <TableCell>
                  <strong>{ev.title}</strong>
                </TableCell>
                <TableCell>
                  {new Date(ev.date).toLocaleString()}
                </TableCell>
                <TableCell>{ev.location}</TableCell>
                <TableCell>
                  <Link href={`/event/${ev.id}`} passHref>
                    <Button variant="outlined" size="small">
                      View
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </main>
  );
}
