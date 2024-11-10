FROM --platform=linux/amd64 python:3.12-slim-bullseye AS compile-image
WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y \
    build-essential \
    software-properties-common \
    libssl-dev \
    libffi-dev \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt /app/requirements.txt
RUN pip install --upgrade pip && pip install -r /app/requirements.txt

FROM --platform=linux/amd64 python:3.12-slim-bullseye AS run-image
WORKDIR app/
#
ENV PYTHONPATH=./
ENV PYTHONUNBUFFERED=1
ENV HOST=0.0.0.0
ENV PORT=9000

COPY --from=compile-image /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages

COPY . /app

EXPOSE 9000

CMD ["python3", "-m", "backend"]