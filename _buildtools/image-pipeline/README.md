# Image Pipeline

A hybrid image optimization pipeline for Jekyll.

The project is split into two independent components:

- **Daemon** (Node.js) — performs all image processing using modern image libraries such as Sharp and SVGO.
- **Jekyll Plugin** (Ruby) — integrates with Jekyll, communicates with the daemon, and rewrites generated HTML into responsive `<picture>` markup.

The two components communicate exclusively through a small versioned JSON protocol over stdin/stdout.

## Goals

- Zero changes required to Markdown authoring.
- Incremental Jekyll builds.
- Process each image only once.
- Cache generated variants.
- Generate responsive images (`srcset` + `<picture>`).
- Preserve a clean separation between image processing and Jekyll integration.
- Keep the daemon reusable outside Jekyll.

## Architecture

```mermaid
sequenceDiagram
    autonumber

    participant J as Jekyll
    participant P as Ruby Plugin
    participant D as Node Daemon
    participant C as Cache
    participant F as Filesystem

    Note over J,D: Initialization

    J->>P: Generate site
    P->>D: POST /v1/init(projectRoot, siteRoot, cacheRoot)
    D->>C: Load manifest
    C-->>D: Cache metadata
    D-->>P: ok

    Note over J,D: Image Generation

    loop For each image StaticFile
        J->>P: write(image)
        P->>D: POST /v1/image(path)
        D->>C: Lookup cache

        alt Cached
            C-->>D: Metadata
        else Generate
            D->>F: Read original image
            D->>D: Generate variants
            D->>F: Write optimized images
            D->>C: Update manifest
        end

        D-->>P: Image metadata
        P-->>J: write complete
    end

    Note over J,D: HTML Rewriting

    J->>P: post_write hook

    loop For each HTML file
        P->>F: Read HTML
        P->>P: Parse with Nokogiri

        loop For each local <img>
            P->>D: POST /v1/image(path)
            D->>C: Lookup cache
            C-->>D: Metadata
            D-->>P: Image metadata
            P->>P: Replace <img> with <picture>
        end

        P->>F: Write HTML
    end

    Note over J,D: Shutdown

    P-->>D: POST /v1/terminate
    D->>C: Remove stale cache entries
    D->>C: Persist manifest
    D-->>P: Exit
```

## Directory Layout

```text
image-pipeline/
├── README.md
├── protocol/
│
├── daemon/
│   ├── src/
│   ├── dist/
│   └── package.json
│
└── jekyll_plugin/
    ├── image_pipeline.gemspec
    ├── Gemfile
    └── lib/
```
