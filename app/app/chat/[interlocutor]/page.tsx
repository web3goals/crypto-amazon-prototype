"use client";

export default function ChatPage({
  params,
}: {
  params: { interlocutor: string };
}) {
  console.log({ params });

  return <main className="container py-10 lg:px-80">Chat...</main>;
}
