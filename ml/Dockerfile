FROM nvidia/cuda:12.1.0-base-ubuntu22.04

RUN apt-get update && \
    apt-get install -y libzbar0 python3-pip && \
    rm -rf /var/lib/apt/lists/*

# install Torch GPU
RUN pip3 install torch==2.1.0 torchvision --index-url https://download.pytorch.org/whl/cu121

# stdout to terminal enable
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app
COPY ./requirements.txt ./requirements.txt

RUN pip3 install -r ./requirements.txt 
COPY . /app
EXPOSE 9202
CMD ["python3", "-m", "API.server"]
