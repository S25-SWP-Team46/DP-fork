FROM haskell:latest as builder
WORKDIR /app
COPY . .
RUN apt-get update && apt-get install -y curl g++ make libtinfo-dev xz-utils tar unzip locales
RUN stack build --copy-bins --install-ghc

FROM alpine:3.19
WORKDIR /export
COPY --from=builder /root/.local/bin/chroma-parser /export/chroma_parser
CMD ["/export/chroma_parser", "--help"]