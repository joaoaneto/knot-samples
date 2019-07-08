# KNoT Hello World App

This is a minimalist webapp built with Node.js/Express and React.
You can use it as an example to create your customized app to interact with
your KNoT Things.

This example was created to work with the HelloWorld example available at the
[KNoT Thing repository](https://github.com/CESARBR/knot-thing-source/tree/master/examples/HelloWorld)


### Configuration

Configuration is made via environment variables. The configuration parameters are:

* `PORT` **Number** Server port number. (Default: 80|3000)
* `AUTH_HOSTNAME` **String** Authenticator service hostname. (Default: **localhost**)
* `AUTH_PORT` **Number** Authenticator service port. (Default: 3004)
* `DATA_HOSTNAME` **String** Storage service hostname. (Default: **localhost**)
* `DATA_PORT` **Number** Storage service port. (Default: 3005)
* `WS_HOSTNAME` **String** WebSocket adapter hostname. (Default: **localhost**)
* `WS_PORT` **Number** WebSocket adapter port. (Default: 3006)

### Build and run (local)

First, install the dependencies:

```
yarn
```

Then:

```
yarn build
yarn start:server
```

### Build and run (local, development)

First, install the dependencies:

```
yarn
```

Then, start the server with auto-reload:

```
yarn start
```

### Build and run (Docker, development)

A development container is specified at `Dockerfile-dev`. To use it, execute the following steps:

1. Build the image:

    ```
    docker build . -f Dockerfile-dev -t knot-samples-hello-world:dev
    ```

1. Create a file containing the configuration as environment variables.
1. Run the container:

    ```
    docker run --env-file hello-world.env -p 4000:80 -v `pwd`:/usr/src/app -ti knot-samples-hello-world
    ```

The first argument to `-v` must be the root of this repository, so if you are running from another folder, replace `` `pwd` `` with the corresponding path.

This will start the server with auto-reload.

### Run (Docker)

Containers built from the master branch and the published tags in this repository are available on [DockerHub](https://hub.docker.com/r/cesarbr/knot-samples-hello-world/).

1. Create a file containing the configuration as environment variables.
1. Run the container:

```
docker run --env-file hello-world.env -p 4000:80 -ti cesarbr/knot-samples-hello-world
```

### Verify

Point your browser to http://&lt;hostname&gt;:&lt;port&gt;.
