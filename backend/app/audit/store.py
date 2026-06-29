import hashlib
import json

from app.models.schemas import AuditEvent


class AuditStore:
    def __init__(self) -> None:
        self.events: list[AuditEvent] = []

    def append(self, event: AuditEvent) -> AuditEvent:
        previous_hash = self.events[-1].event_hash if self.events else None
        event.previous_hash = previous_hash
        payload = event.model_dump(mode="json", exclude={"event_hash"})
        event.event_hash = hashlib.sha256(
            json.dumps(payload, sort_keys=True, default=str).encode("utf-8")
        ).hexdigest()
        self.events.append(event)
        return event

    def list(self) -> list[AuditEvent]:
        return self.events[:]

    def count(self) -> int:
        return len(self.events)


audit_store = AuditStore()
