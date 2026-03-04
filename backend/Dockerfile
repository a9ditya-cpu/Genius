FROM python:3.9-slim

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend and ml_engine
COPY ./backend /app/backend
COPY ./ml_engine /app/ml_engine

# Set python path so backend can import ml_engine
ENV PYTHONPATH=/app

WORKDIR /app/backend
EXPOSE 5000

CMD ["flask", "run", "--host=0.0.0.0"]
