FROM envoyproxy/envoy:latest

ADD ./server.crt /etc/server.crt
ADD ./server.key /etc/server.key

RUN apt-get update && apt-get upgrade -y

CMD /usr/local/bin/envoy -c /etc/envoy.yaml -l debug --service-cluster proxy
