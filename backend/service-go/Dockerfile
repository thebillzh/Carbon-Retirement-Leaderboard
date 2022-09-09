FROM golang:1.17 AS builder

ARG app_name

COPY . /src
WORKDIR /src/app/${app_name}

RUN make build

FROM debian:stable-slim

ARG app_name
ENV TZ=UTC \
    DEBIAN_FRONTEND=noninteractive
RUN ln -fs /usr/share/zoneinfo/${TZ} /etc/localtime \
    && echo ${TZ} > /etc/timezone \
    && dpkg-reconfigure --frontend noninteractive tzdata \
    && rm -rf /var/lib/apt/lists/*
RUN apt-get update && apt-get install -y --no-install-recommends \
		ca-certificates  \
        netbase \
        && rm -rf /var/lib/apt/lists/ \
        && apt-get autoremove -y && apt-get autoclean -y

COPY --from=builder /src/app/${app_name}/bin /app
COPY --from=builder /src/app/${app_name}/configs /data/conf

WORKDIR /app

EXPOSE 8000
EXPOSE 9000

CMD ["./{{ APP_NAME }}", "-conf", "/data/conf"]
