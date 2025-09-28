import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Snackbar,
  Paper,
} from "@mui/material";

function endsWithEmoji(text: string) {
  return /\p{Extended_Pictographic}$/u.test(text.trim());
}

export default function CreatePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  function validate() {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = "Title is required";
    else if (!endsWithEmoji(title)) e.title = "Title must end with an emoji";
    if (!date) e.date = "Date is required";
    if (!location.trim()) e.location = "Location is required";
    return e;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          date: new Date(date).toISOString(),
          location: location.toUpperCase(),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        setErrors({ submit: err?.error || "Failed to create event" });
        setSubmitting(false);
        return;
      }

      // Show success snackbar
      setSuccessOpen(true);

      // redirect after short delay
      setTimeout(() => router.push("/?created=true"), 1500);
    } catch (err) {
      setErrors({ submit: "Request failed" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Create Event
      </Typography>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 2 }}>
            <TextField
              label="Title (must end with emoji)"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={!!errors.title}
              helperText={errors.title}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <TextField
              type="datetime-local"
              label="Date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              error={!!errors.date}
              helperText={errors.date}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <TextField
              label="Location (will be stored UPPERCASE)"
              fullWidth
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              error={!!errors.location}
              helperText={errors.location}
            />
          </Box>

          {errors.submit && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors.submit}
            </Alert>
          )}

          <Button type="submit" variant="contained" disabled={submitting}>
            {submitting ? "Creating…" : "Create"}
          </Button>
        </form>
      </Paper>

      <Snackbar
        open={successOpen}
        autoHideDuration={2000}
        onClose={() => setSuccessOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSuccessOpen(false)}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Event created successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
}
