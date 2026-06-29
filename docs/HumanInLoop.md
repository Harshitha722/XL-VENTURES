# Human In The Loop

Humans always retain final authority. Confidence below 70 triggers mandatory review. Confidence 70 or higher allows optional review.

Review actions include:

- Approve
- Reject
- Override
- Delegate
- Escalate
- Request information

A review call updates report `review_status`, appends the review payload to `review_history`, stores feedback memory, and creates a hash-linked audit event. Overrides can also attach human modification summaries to recommendations.
