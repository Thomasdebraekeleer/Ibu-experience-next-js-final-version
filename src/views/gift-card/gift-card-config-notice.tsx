import "server-only";

import type { GiftCardSystemPublicStatus } from "@/server/gift-cards/public-status";

type Props = {
  status: GiftCardSystemPublicStatus;
};

export default function GiftCardConfigNotice({ status }: Props) {
  if (status.automationConfigured) {
    return null;
  }

  return (
    <div className="container container-1530 mb-4">
      <div
        className="alert alert-warning mb-0"
        role="status"
        style={{ borderRadius: 12 }}
      >
        {status.messages.map((message) => (
          <p key={message} className="mb-0">
            {message}
          </p>
        ))}
      </div>
    </div>
  );
}
