# Optimized In-Store Inventory Management System for Markdown Events

## Project Description
A comprehensive, full-stack application designed to optimize in-store inventory and dynamic pricing for markdown events. This system empowers retail staff to make data-driven decisions on stock levels and dynamic pricing to prevent overstocking and stockouts.

## Features
- **Real-Time Inventory Tracking**: View current stock levels, prices, and critical updates.
- **Dynamic Price Optimization**: Machine learning models suggest optimal markdown prices based on demand and historical data.
- **Responsive Dashboard**: Mobile-ready React interface tailored for in-store staff devices.
- **Advanced Visualizations**: D3.js powered charts to compare projected sales versus actual stock over time.

## System Architecture
- **Backend**: Python / Flask API
- **Database**: MongoDB
- **Machine Learning Engine**: Scikit-learn (Demand Forecasting) & TensorFlow (Price Optimization)
- **Frontend**: React.js / D3.js

## Setup Instructions

### Prerequisites
- Python 3.9+
- Node.js & npm
- MongoDB (running locally or a remote MongoDB URI)

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

5. **Docker Compose (Optional)**:
   ```bash
   docker-compose up --build
   ```

## API Documentation
- `GET /api/inventory`: Fetch all current stock levels.
- `POST /api/markdown`: Trigger a markdown event, calculates new optimal price via ML models.
- `PUT /api/inventory/update`: Update stock levels and custom prices in real-time.

## License
This project is licensed under the [MIT License](LICENSE).
