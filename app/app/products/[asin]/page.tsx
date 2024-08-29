"use client";

export default function ProductPage({ params }: { params: { asin: string } }) {
  console.log({ params });

  return <main className="container py-10 lg:px-80">Product...</main>;
}
