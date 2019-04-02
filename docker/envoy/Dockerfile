FROM envoyproxy/envoy-alpine:latest

RUN apt-get update && apt-get upgrade -y

CMD /usr/local/bin/envoy -c /etc/envoy.yaml -l debug --service-cluster proxy
