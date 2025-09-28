import React from 'react';
import { GetServerSideProps } from 'next';
import { getEventById } from '../../lib/events';
import { Event } from '../../types/event';

type Props = { event?: Event };

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params || {};
  if (!id || Array.isArray(id)) return { notFound: true };
  const event = await getEventById(id);
  if (!event) return { notFound: true };
  return { props: { event } };
};

export default function EventPage({ event }: Props) {
  if (!event) {
    return <main style={{ padding: 20 }}><h1>Event not found</h1></main>;
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>{event.title}</h1>
      <div>Date: {new Date(event.date).toLocaleString()}</div>
      <div>Location: {event.location}</div>
      <div style={{ marginTop: 12 }}>{event.description}</div>
    </main>
  );
}
