# Developer Guide

Backend code lives in `backend/app`. Frontend code lives in `frontend/app`. Ontologies live in `knowledge/ontology`.

Add a new domain by creating a YAML ontology with business goals, KPIs, risks, opportunities, success metrics, agent capabilities, tools, and scenario templates. No new static agent class is required.

Run backend tests with `pytest`. Run frontend type checks with `npx tsc --noEmit`.
