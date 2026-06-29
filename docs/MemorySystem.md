# Memory System

Memory categories include short-term memory, long-term memory, semantic memory, episodic memory, and human feedback memory.

The current implementation keeps memory in the backend process and exposes it through `/memory`. Each analysis stores episodic and semantic records. Each human review stores feedback memory. Production deployments can persist the same typed `MemoryRecord` schema in PostgreSQL, Redis, or a vector store.

Stored memory supports:

- Approvals
- Rejections
- Overrides
- Past recommendations
- Business goals, risks, opportunities, and outcomes
- Review comments and human modifications
