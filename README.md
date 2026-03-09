# 🧠 Genius: ML-Powered Retail Logistics & Dynamic Pricing

## Project Description
A comprehensive, full-stack application designed to optimize in-store inventory and dynamic pricing for markdown events. This system empowers retail staff to make data-driven decisions on stock levels and dynamic pricing to prevent overstocking and stockouts.

## System Architecture

The Genius platform operates on a robust, microservices-oriented architecture deployed on AWS EC2, featuring real-time AI integration.

```mermaid
graph TD
    Client[Web & Mobile Clients] -->|HTTPS Requests| Nginx[Nginx Reverse Proxy]
    
    subgraph "Dockerized Environment (AWS EC2)"
        Nginx -->|Route/ UI| React[React.js Frontend]
        Nginx -->|Route /api/*| Flask[Python Flask API]
        
        React -->|State Mgmt| Context[React Context API]
        React -->|Metrics| D3[D3.js Visualization]
        
        Flask -->|Pricing Algorithms| Scikit[Scikit-learn/TensorFlow]
        Flask -->|GenAI Copilot| BERT[HuggingFace QA BERT]
    end
    
    Flask -->|CRUD Operations| MongoDB[(MongoDB Atlas)]
    
    classDef react fill:#61DAFB,stroke:#333,stroke-width:1px,color:#000;
    classDef python fill:#FFD43B,stroke:#333,stroke-width:1px,color:#000;
    classDef db fill:#47A248,stroke:#333,stroke-width:1px,color:#fff;
    classDef proxy fill:#009639,stroke:#333,stroke-width:1px,color:#fff;
    
    class React,Context react;
    class Flask,Scikit,BERT python;
    class MongoDB db;
    class Nginx proxy;
```

## Data Flow & Multi-Role Access

The platform utilizes a multi-interface Role-Based Access Control (RBAC) system to securely route live data between operational staff and the centralized ML engine.

```mermaid
sequenceDiagram
    participant C as Cashier (/pos)
    participant M as Manager (/receive)
    participant A as Admin (Dashboard)
    participant DB as MongoDB Atlas
    participant ML as AI Optimization Engine

    C->>DB: Process Checkouts (RFID Kiosk)
    DB-->>ML: Continuous Sales Velocity Data
    
    M->>ML: Send NLP Chat Query ("Received 40 units")
    ML-->>DB: Execute Semantic Database Mutation
    
    ML-->>A: Flag Scarcity Anomalies & Price Hacks
    A->>DB: Authorize System-Wide Margin Markups
```

## Setup Instructions

### Prerequisites
- Python 3.9+
- Node.js & npm
- MongoDB Atlas cluster

### Local Development Setup

1. **Clone the repository** (or use the provided source code).

2. **Environment Variables**:
   Copy `.env.example` to `.env` in the root directory and update your values (like `MONGO_URI`).

3. **Backend & ML Engine Setup**:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   flask run
   ```

4. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## License
This project is licensed under the [MIT License](LICENSE).