"use client";

import React from "react";
import ClientOnly from "../../components/ClientOnly";
import HomePolls from "../../components/HomePolls";

export default function PollsPage() {
  return (
    <div className="py-20">
      <ClientOnly>
        <HomePolls />
      </ClientOnly>
    </div>
  );
}
