FROM ubuntu:22.04

RUN apt-get update && apt-get install -y curl
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get install -y nodejs

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn install; \
  elif [ -f package-lock.json ]; then npm install; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm install; \
  else echo "Lockfile not found." && exit 1; \
  fi

COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

ENV PORT 3000

EXPOSE 3000

CMD [ "pnpm", "run", "dev" ]
# CMD  ["/bin/bash", "-c", "echo 'Hello World'; tail -f /dev/null"]