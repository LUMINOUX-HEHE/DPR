# Architecture Summary: Offline-First Sync

**Prasthav-AI** is designed for the high-latency and low-connectivity environments of North Eastern India.

## 1. Local-First Processing
- **AI Scrutiny**: Lightweight NLP models (Transformers-lite) run on regional branch servers or authorized laptops using ONNX Runtime. This ensures DPR evaluation doesn't fail due to internet outages.
- **Data Persistence**: Uses a browser-based IndexedDB (via Dexie.js or PouchDB) to store DPR drafts and evaluation logs locally.

## 2. Sync Hierarchy
- **Conflict Resolution**: Last-Write-Wins (LWW) strategy for simple metadata, while evaluation reports use CRDTs (Conflict-free Replicated Data Types) to merge comments from multiple officers during field visits.
- **Phased Sync**:
    - **Tier 1 (Instant)**: Local database update.
    - **Tier 2 (Deferred)**: Automatic sync to State HQ when connectivity > 50kbps.
    - **Tier 3 (Global)**: Central MDoNER repository sync via NIC (National Informatics Centre) VPN.

## 3. Technology Stack
- **Frontend**: React + Tailwind (Indigo/Navy Government Palette).
- **Communication**: gRPC-web for compressed payload transfers over low bandwidth.
- **Security**: AES-256 encryption for local storage; Mutual TLS (mTLS) for HQ synchronization.

## 4. SIH Advantage
Unlike generic cloud-only AI solutions, Prasthav-AI is **deployment-ready** for remote border districts of Arunachal Pradesh or Mizoram where digital infrastructure may be intermittent.
