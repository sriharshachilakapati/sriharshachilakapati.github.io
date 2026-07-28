# Communication Protocol between Node daemon and Ruby plugin

While the Jekyll ruby plugin is responsible for hooking into the Jekyll build process and rewriting HTML, it delegates all image processing tasks to a separate Node.js daemon. This separation of concerns is chosen because Node.js has a better ecosystem for image processing, and it allows the heavy lifting to be done in a more performant environment.

This document describes the communication protocol between the Ruby plugin and the Node daemon.

## Communication Protocol

The Ruby plugin launches the Node daemon as a child process and communicates with it using standard input/output streams. The communication is structured as a simple request-response protocol, where the Ruby plugin sends requests to the daemon and waits for responses.

Both the requests and responses are formatted as newline-delimited JSON objects. Each request from the Ruby plugin will result in exactly one response from the Node daemon.

## Protocol Versioning

Every request and response includes version in the end-point, allowing for different versions of the commands to be supported in the future. The current protocol version is 1.

### Request Structure

```hjson
{
  "endpoint": "v1/command_name",
  "requestId": "unique_request_id",
  "payload": {
    // command-specific parameters
  }
}
```

### Response Structure

All the responses from the Node daemon will have the following structure:

```hjson
{
    "requestId": "unique_request_id",
    "status": "ok" | "error",
    "payload": {
        // command-specific response data
    }
}
```

The response includes the `requestId` to correlate it with the original request, a `status` field indicating success or failure, and a `payload` containing command-specific response data. This is to allow for parallel requests and responses without confusion.

## Commands

### `init` command

The `init` command initializes a daemon session. This should be the first command sent after starting the daemon before any other commands are issued. The request structure is as follows:

```json
{
  "endpoint": "v1/init",
  "requestId": "unique_request_id",
  "payload": {
    "projectRoot": "...",
    "siteRoot": "...",
    "cacheRoot": "..."
  }
}
```

For the response of initialization, `payload` will be `null` and the `status` will be `ok` if the initialization was successful. If there was an error, the `status` will be `error`, and the `payload` will contain an error message.

### `image` command

The `image` command is used to request information required to get all the necessary image variants for a given image. The daemon will take care of the caching and processing of the image, and return the metadata of the generated image variants.

```json
{
  "endpoint": "v1/image",
  "requestId": "unique_request_id",
  "payload": {
    "imagePath": "..."
  }
}
```

The response will contain the following response.

```hjson
{
  "requestId": "unique_request_id",
  "status": "ok",
  "payload": {
    "width": 1920,
    "height": 1080,
    "path": "path/to/original/image.png",
    "variants": {
      "144p": {
        "width": 256,
        "height": 144,
        "avif": "path/to/144.avif",
        "webp": "path/to/144.webp",
        "png": "path/to/144.png",
        "jpeg": "path/to/144.jpeg"
      },
      "240p": {
        "width": 426,
        "height": 240,
        "avif": "path/to/244.avif",
        "webp": "path/to/244.webp",
        "png": "path/to/244.png",
        "jpeg": "path/to/244.jpeg"
      },
      // And continued
    }
  }
}
```

Resolutions of the images are based on the standard video resolutions, and the daemon will generate the variant images based on the original image's aspect ratio. The daemon is responsible for determining whether variants need to be regenerated or can be served directly from cache.

### Image Variant Generation Algorithm

The daemon will generate image variants based on the original image's aspect ratio and the standard video resolutions. The following steps outline the algorithm used to generate the variants:

```
Algorithm: Generate Image Variants

Input:
    - Source image I
    - TargetWidths: ordered list of widths in ascending order

Output:
    - Set of resized image variants

Procedure:
    1. Read the source image dimensions:
           W ← source width
           H ← source height

    2. For each width T in TargetWidths:
           if T > W:
               continue    // Never upscale

           scale ← T / W
           newWidth  ← T
           newHeight ← round(H × scale)

           Resize the image to (newWidth, newHeight)
           Preserve the original aspect ratio
           Store the resized image

    3. If the original image width is not already represented,
       include the original image as the largest variant.

    4. Return the generated variants.
```

While we mentioned `TargetWidths` in the algorithm, the actual widths used for generating variants are based on standard video resolutions, which include – 144p, 240p, 360p, 480p, 720p, 1080p, 1440p, and 2160p. The daemon will ensure that the generated variants maintain the original image's aspect ratio and will not upscale images beyond their original dimensions.

Daemon will also ensure that no matter the original request ID, if the hash in the path of original image is the same, it reuses from the cache and returns the same response.

## `terminate` command

The `terminate` command is used to gracefully shut down the daemon. This command should be sent when the Ruby plugin is done with all image processing tasks and wants to terminate the daemon process.

```json
{
  "endpoint": "v1/terminate",
  "requestId": "unique_request_id",
  "payload": {}
}
```

The daemon will then enter cleanup mode, ensuring that all the images that are in cache, but deleted from the source are removed from the cache. The response will be:

```json
{
  "requestId": "unique_request_id",
  "status": "ok",
  "payload": null
}
```

## Caching Logic

How the daemon handles the caching is an implementation detail, but it will ensure that the cache is cleaned up and does not grow indefinitely. Caching will also include a mechanism to ensure that if a format handler has a functionality change, the cache is invalidated and regenerated. The daemon will also ensure that if the original image is deleted, the cached variants are also removed.
